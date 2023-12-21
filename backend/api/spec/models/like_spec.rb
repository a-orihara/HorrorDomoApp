require 'rails_helper'

RSpec.describe Like, type: :model do
  # 必要なファクトリを使用してlikeオブジェクトを作成します
  let(:like) { build(:like) }

  describe 'バリデーション' do
    it 'user_idが存在する' do
      expect(like).to validate_presence_of(:user_id)
    end

    it 'post_idが存在する' do
      expect(like).to validate_presence_of(:post_id)
    end
  end

  describe 'アソシエーション' do
    it 'postに属する' do
      expect(like).to belong_to(:post)
    end

    it 'userに属する' do
      expect(like).to belong_to(:user)
    end
  end
end
