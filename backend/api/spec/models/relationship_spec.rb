require 'rails_helper'

RSpec.describe Relationship, type: :model do
  let(:follower) { create(:user) }
  let(:followed) { create(:user) }
  let(:relationship) { create(:relationship, follower_id: follower.id, followed_id: followed.id) }

  describe 'バリデーション' do
    context 'follower_idとfollowed_idが存在する場合' do
      it '有効であること' do
        expect(relationship).to be_valid
      end
    end

    context 'follower_idが存在しない場合' do
      before do
        relationship.follower_id = nil
      end

      it '無効であること' do
        expect(relationship).not_to be_valid
      end
    end

    context 'followed_idが存在しない場合' do
      before do
        relationship.followed_id = nil
      end

      it '無効であること' do
        expect(relationship).not_to be_valid
      end
    end
  end
end

=begin
@          @@          @@          @@          @@          @@          @@          @@          @
1
`let(:follower) { create(:user) }` と `let(:followed) { create(:user) }` により、followerと
followedにはそれぞれ別のuser.idを持つUserが作成されます。
- `create(:user)`はFactoryBotを使用して新しいUserをデータベースに作成します。
- これは各`let`ステートメントで独立して呼び出されますので、followerとfollowedは別々のUserオブジェクトを指しま
す。
- したがって、それぞれのUserオブジェクトはデータベース上でユニークなidを持つことになります。
------------------------------------------------------------------------------------------------
`let(:relationship) { create(:relationship, follower_id: follower.id, followed_id: followed.id) }`
は、上記で作成したfollowerとfollowedを指します。
- RSpecの`let`は遅延評価がされ、呼ばれた時点で初めて評価されます。
- `relationship`を呼び出すとき、その中で`follower.id`と`followed.id`が呼び出され、この時点で初めて
`follower`と`followed`が評価され、Userが作成されます。
- そのため、このrelationshipオブジェクトは先程作成したfollowerとfollowedのidを持つ関係を表します。
=end
