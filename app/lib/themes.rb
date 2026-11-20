# frozen_string_literal: true

class Themes
  include Singleton

  THEME_COLORS = {
    dark: '#181820',
    light: '#ffffff',
  }.freeze

  def initialize
    @conf = YAML.load_file(Rails.root.join('config', 'themes.yml'))
  end

  def names
    @conf.keys
  end

  def available_theme_colors(theme)
    return [] unless @conf[theme].is_a?(Hash) && @conf[theme]['colors'].present?

    @conf[theme]['colors']
  end

  # Crazynewworld: a theme can force a color scheme ('dark' or 'light')
  def forced_color_scheme(theme)
    return unless @conf[theme].is_a?(Hash)

    @conf[theme]['color_scheme'].presence_in(%w(dark light))
  end

  # Crazynewworld: wallpapers a theme lets users choose from
  def available_wallpapers(theme)
    return [] unless @conf[theme].is_a?(Hash) && @conf[theme]['wallpapers'].present?

    @conf[theme]['wallpapers']
  end
end
