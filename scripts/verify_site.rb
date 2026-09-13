#!/usr/bin/env ruby
# frozen_string_literal: true

require 'json'
require 'pathname'
require 'yaml'

ROOT = Pathname.new(__dir__).join('..').expand_path
SITE_DIR = Pathname.new(ARGV.fetch(0, ROOT.join('_site').to_s)).expand_path
BASEURL = ARGV.fetch(1, '').sub(%r{/+$}, '')
INDEX_FILE = SITE_DIR.join('index.html')

abort "ERROR: #{INDEX_FILE} does not exist" unless INDEX_FILE.file?

errors = []
html = INDEX_FILE.read

prompt_rows = ROOT.join('_prompts').glob('*.md').sort.map do |path|
  source = path.read
  yaml_source = source[/\A---\s*\n(.*?)\n---/m, 1]
  next unless yaml_source

  data = YAML.safe_load(yaml_source, permitted_classes: [], aliases: false)
  data if data['status'] == 'published'
end.compact

card_count = html.scan(/\sdata-prompt-card(?:\s|>)/).length
errors << "expected #{prompt_rows.length} cards, found #{card_count}" unless card_count == prompt_rows.length

prompt_rows.each do |prompt|
  prompt_id = prompt['prompt_id']
  errors << "missing data-prompt-id for #{prompt_id}" unless html.scan(%(data-prompt-id="#{prompt_id}")).length == 1
  errors << "missing copy target for #{prompt_id}" unless html.include?(%(id="prompt-#{prompt_id}"))
end

ids = html.scan(/\sid="([^"]+)"/).flatten
duplicate_ids = ids.group_by(&:itself).select { |_id, values| values.length > 1 }.keys
errors << "duplicate HTML ids: #{duplicate_ids.join(', ')}" unless duplicate_ids.empty?

references = html.scan(/\s(?:aria-labelledby|aria-describedby|aria-controls|data-copy-target|data-expand-target)="([^"]+)"/)
  .flatten
  .flat_map { |value| value.split(/\s+/) }
missing_references = references.uniq.reject { |reference| ids.include?(reference) }
errors << "missing referenced ids: #{missing_references.join(', ')}" unless missing_references.empty?

expected_tags = prompt_rows.flat_map { |prompt| prompt['tags'] }.uniq.sort
rendered_tags = html.scan(/\sdata-tag="([^"]+)"/).flatten.uniq.sort
errors << "filter tags differ: expected #{expected_tags.inspect}, found #{rendered_tags.inspect}" unless rendered_tags == expected_tags

errors << 'unresolved Liquid markup remains in index.html' if html.match?(/\{[{%].*?[}%]\}/m)

synonym_json = html[%r{<script type="application/json" id="search-synonyms">(.*?)</script>}m, 1]
if synonym_json.nil?
  errors << 'missing search-synonyms JSON script'
else
  begin
    synonym_groups = JSON.parse(synonym_json)
    errors << 'search-synonyms JSON must be a non-empty array' unless synonym_groups.is_a?(Array) && !synonym_groups.empty?
  rescue JSON::ParserError => e
    errors << "search-synonyms JSON is invalid: #{e.message}"
  end
end

%w[data-show-more data-show-more-button data-active-filters data-filter-group].each do |hook|
  errors << "missing #{hook} hook in index.html" unless html.include?(hook)
end

asset_prefix = "#{BASEURL}/assets/".gsub(%r{/+}, '/')
%w[css/site.css js/catalog.js favicon.svg].each do |asset|
  public_url = "#{asset_prefix}#{asset}"
  errors << "missing public asset reference #{public_url}" unless html.include?(public_url)
  errors << "missing generated asset assets/#{asset}" unless SITE_DIR.join('assets', asset).file?
end

if errors.empty?
  puts "OK: generated site contains #{card_count} cards, #{ids.length} unique ids, and valid internal references."
  exit 0
end

errors.each { |error| warn "ERROR: #{error}" }
warn "FAILED: #{errors.length} generated-site error(s)."
exit 1
