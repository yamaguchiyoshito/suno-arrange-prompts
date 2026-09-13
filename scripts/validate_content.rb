#!/usr/bin/env ruby
# frozen_string_literal: true

require 'date'
require 'pathname'
require 'yaml'

ROOT = Pathname.new(__dir__).join('..').expand_path
PROMPT_DIR = ROOT.join('_prompts')
TAG_FILE = ROOT.join('_data', 'tags.yml')

REQUIRED_FIELDS = %w[
  schema_version prompt_id slug title description bpm vocals tags tip_label tip
  status order created_at updated_at
].freeze
ALLOWED_FIELDS = (REQUIRED_FIELDS + %w[bpm_range]).freeze
ALLOWED_GROUPS = %w[producer source genre voice instrument arrangement rhythm].freeze
ALLOWED_STATUS = %w[published draft archived].freeze
ALLOWED_VOCALS = %w[vocal instrumental].freeze
MAX_PROMPT_LENGTH = 1000

errors = []
warnings = []

def normalized(value)
  value.to_s.unicode_normalize(:nfkc).downcase.strip.gsub(/\s+/, ' ')
rescue NoMethodError
  value.to_s.downcase.strip.gsub(/\s+/, ' ')
end

def duplicate_top_level_keys(yaml_source)
  yaml_source.lines
    .map { |line| line[/\A([a-z][a-z0-9_]*):/, 1] }
    .compact
    .group_by(&:itself)
    .select { |_key, values| values.length > 1 }
    .keys
end

def parse_date(value)
  Date.iso8601(value.to_s)
rescue Date::Error
  nil
end

begin
  tag_rows = YAML.safe_load(TAG_FILE.read, permitted_classes: [], aliases: false)
rescue StandardError => e
  abort "ERROR: #{TAG_FILE.relative_path_from(ROOT)}: #{e.message}"
end

unless tag_rows.is_a?(Array)
  abort 'ERROR: _data/tags.yml must contain a YAML array.'
end

tags_by_id = {}
search_terms = {}
group_labels = {}

tag_rows.each_with_index do |tag, index|
  location = "_data/tags.yml entry #{index + 1}"
  unless tag.is_a?(Hash)
    errors << "#{location}: must be a map"
    next
  end

  missing = %w[id label group group_label aliases].reject { |field| tag.key?(field) }
  errors << "#{location}: missing #{missing.join(', ')}" unless missing.empty?
  next unless missing.empty?

  id = tag['id']
  errors << "#{location}: invalid id #{id.inspect}" unless id.is_a?(String) && id.match?(/\A[a-z0-9]+(?:-[a-z0-9]+)*\z/)
  errors << "#{location}: duplicate id #{id}" if tags_by_id.key?(id)
  errors << "#{location}: unsupported group #{tag['group'].inspect}" unless ALLOWED_GROUPS.include?(tag['group'])
  errors << "#{location}: aliases must be an array" unless tag['aliases'].is_a?(Array)
  if tag['group'] == 'genre' && (!tag['code'].is_a?(String) || tag['code'].strip.empty?)
    errors << "#{location}: genre tags require a non-empty code"
  end

  if group_labels.key?(tag['group']) && group_labels[tag['group']] != tag['group_label']
    errors << "#{location}: group_label differs from other #{tag['group']} tags"
  else
    group_labels[tag['group']] = tag['group_label']
  end

  ([tag['label']] + Array(tag['aliases'])).each do |term|
    key = normalized(term)
    errors << "#{location}: label or alias must not be blank" if key.empty?
    if search_terms.key?(key) && search_terms[key] != id
      errors << "#{location}: search term #{term.inspect} conflicts with tag #{search_terms[key]}"
    else
      search_terms[key] = id
    end
  end

  tags_by_id[id] = tag
end

prompt_files = PROMPT_DIR.glob('*.md').sort
errors << '_prompts: no Markdown files found' if prompt_files.empty?

seen_ids = {}
seen_slugs = {}
seen_orders = {}
used_tags = Hash.new(0)

prompt_files.each do |path|
  relative = path.relative_path_from(ROOT).to_s
  source = path.read
  match = source.match(/\A---\s*\n(?<front_matter>.*?)\n---\s*\n(?<body>.*)\z/m)

  unless match
    errors << "#{relative}: missing YAML front matter"
    next
  end

  duplicates = duplicate_top_level_keys(match[:front_matter])
  errors << "#{relative}: duplicate front matter keys: #{duplicates.join(', ')}" unless duplicates.empty?

  begin
    data = YAML.safe_load(match[:front_matter], permitted_classes: [], aliases: false)
  rescue StandardError => e
    errors << "#{relative}: invalid YAML: #{e.message}"
    next
  end

  unless data.is_a?(Hash)
    errors << "#{relative}: front matter must be a map"
    next
  end

  missing = REQUIRED_FIELDS.reject { |field| data.key?(field) }
  unknown = data.keys - ALLOWED_FIELDS
  errors << "#{relative}: missing fields: #{missing.join(', ')}" unless missing.empty?
  errors << "#{relative}: unknown fields: #{unknown.join(', ')}" unless unknown.empty?
  next unless missing.empty?

  id = data['prompt_id']
  slug = data['slug']
  errors << "#{relative}: schema_version must be 1" unless data['schema_version'] == 1
  errors << "#{relative}: invalid prompt_id #{id.inspect}" unless id.is_a?(String) && id.match?(/\Asuno-[0-9]{6}\z/)
  errors << "#{relative}: duplicate prompt_id #{id}" if seen_ids.key?(id)
  errors << "#{relative}: invalid slug #{slug.inspect}" unless slug.is_a?(String) && slug.match?(/\A[a-z0-9]+(?:-[a-z0-9]+)*\z/)
  errors << "#{relative}: filename must be #{slug}.md" unless path.basename('.md').to_s == slug
  errors << "#{relative}: duplicate slug #{slug}" if seen_slugs.key?(slug)

  title = data['title']
  description = data['description']
  errors << "#{relative}: title must be 1..80 characters" unless title.is_a?(String) && title == title.strip && title.length.between?(1, 80)
  errors << "#{relative}: description must be 1..160 characters" unless description.is_a?(String) && description == description.strip && description.length.between?(1, 160)
  bpm = data['bpm']
  bpm_range = data['bpm_range']
  valid_bpm = bpm.nil? || (bpm.is_a?(Integer) && bpm.between?(20, 300))
  errors << "#{relative}: bpm must be null or an integer from 20 to 300" unless valid_bpm
  if bpm_range
    valid_range = bpm_range.is_a?(Array) && bpm_range.length == 2 &&
      bpm_range.all? { |value| value.is_a?(Integer) && value.between?(20, 300) } &&
      bpm_range.first <= bpm_range.last
    errors << "#{relative}: bpm_range must be [minimum, maximum] from 20 to 300" unless valid_range
    errors << "#{relative}: bpm and bpm_range cannot both be set" unless bpm.nil?
  end
  errors << "#{relative}: vocals must be vocal or instrumental" unless ALLOWED_VOCALS.include?(data['vocals'])
  errors << "#{relative}: status must be #{ALLOWED_STATUS.join(', ')}" unless ALLOWED_STATUS.include?(data['status'])
  errors << "#{relative}: order must be a positive integer" unless data['order'].is_a?(Integer) && data['order'].positive?
  errors << "#{relative}: duplicate order #{data['order']}" if seen_orders.key?(data['order'])

  %w[tip_label tip].each do |field|
    errors << "#{relative}: #{field} must not be blank" unless data[field].is_a?(String) && !data[field].strip.empty?
  end

  tag_ids = data['tags']
  unless tag_ids.is_a?(Array) && tag_ids.length.between?(1, 8) && tag_ids.all? { |tag| tag.is_a?(String) }
    errors << "#{relative}: tags must contain 1..8 tag ids"
    tag_ids = []
  end

  errors << "#{relative}: duplicate tags" unless tag_ids.uniq.length == tag_ids.length
  tag_ids.each do |tag_id|
    errors << "#{relative}: unknown tag #{tag_id}" unless tags_by_id.key?(tag_id)
    used_tags[tag_id] += 1
  end

  grouped_tags = tag_ids
    .map { |tag_id| tags_by_id[tag_id]&.fetch('group', nil) }
    .compact
    .each_with_object(Hash.new(0)) { |group, counts| counts[group] += 1 }
  errors << "#{relative}: exactly one genre tag is required" unless grouped_tags['genre'] == 1
  errors << "#{relative}: exactly one voice tag is required" unless grouped_tags['voice'] == 1
  errors << "#{relative}: at least one instrument tag is required" unless grouped_tags.fetch('instrument', 0).positive?
  errors << "#{relative}: at least one arrangement tag is required" unless grouped_tags.fetch('arrangement', 0).positive?
  errors << "#{relative}: vocals and voice tag differ" unless tag_ids.include?(data['vocals'])

  created_at = parse_date(data['created_at'])
  updated_at = parse_date(data['updated_at'])
  errors << "#{relative}: created_at must be YYYY-MM-DD" unless created_at
  errors << "#{relative}: updated_at must be YYYY-MM-DD" unless updated_at
  errors << "#{relative}: updated_at precedes created_at" if created_at && updated_at && updated_at < created_at

  body = match[:body].strip
  code_match = body.match(/\A```text\n(?<prompt>.+)\n```\z/m)
  errors << "#{relative}: body must contain exactly one non-empty text code block" unless code_match
  if code_match
    errors << "#{relative}: prompt must not contain HTML" if code_match[:prompt].match?(/<\/?[a-z][^>]*>/i)
    prompt_length = code_match[:prompt].length
    if prompt_length > MAX_PROMPT_LENGTH
      errors << "#{relative}: prompt exceeds #{MAX_PROMPT_LENGTH} characters (#{prompt_length})"
    end
  end

  seen_ids[id] = relative
  seen_slugs[slug] = relative
  seen_orders[data['order']] = relative
end

unused_tags = tags_by_id.keys.reject { |tag_id| used_tags.key?(tag_id) }
warnings << "unused tags: #{unused_tags.join(', ')}" unless unused_tags.empty?

warnings.each { |warning| warn "WARNING: #{warning}" }
if errors.empty?
  puts "OK: #{prompt_files.length} prompts and #{tags_by_id.length} tags are valid."
  exit 0
end

errors.each { |error| warn "ERROR: #{error}" }
warn "FAILED: #{errors.length} validation error(s)."
exit 1
