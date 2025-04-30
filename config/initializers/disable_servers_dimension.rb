# frozen_string_literal: true
#
# Remove the “servers” dimension so the “Top active servers” widget
# disappears from the admin dashboard and its heavy SQL is never run.
#
Rails.application.config.after_initialize do
  next unless defined?(Admin::Metrics::Dimension::DIMENSIONS)

  # ① DIMENSIONS は frozen なので dup して編集
  new_dimensions = Admin::Metrics::Dimension::DIMENSIONS.dup
  removed = new_dimensions.delete(:servers)

  # ② ‘servers’ が存在していれば定数を差し替え
  if removed
    Admin::Metrics::Dimension.send(:remove_const, :DIMENSIONS)
    Admin::Metrics::Dimension.const_set(:DIMENSIONS, new_dimensions.freeze)

    Rails.logger.info('[init] “Top active servers” widget disabled (servers dimension removed)')
  end
end
