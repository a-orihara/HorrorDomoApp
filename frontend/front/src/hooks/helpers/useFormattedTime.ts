// frontend/front/src/hooks/useFormattedTime.ts
import { differenceInDays, format, formatDistanceToNow } from 'date-fns';
import { utcToZonedTime } from 'date-fns-tz';
import { ja } from 'date-fns/locale';

// postContextから取得したpostを利用するので、undefinedの可能性がある
const useFormattedTime = (createdAt: string | undefined) => {
  // 2 date-fns-tzパッケージを使ってUTC時間を日本時間に変換し、フォーマットを指定
  if (!createdAt) {
    return ''; // createdAtがundefinedの場合、空文字を返す
  }
  const japanTime = utcToZonedTime(createdAt, 'Asia/Tokyo');
  // 3
  const formattedTime = format(japanTime, 'yyyy/MM/dd');
  // 4
  const relativeTime = formatDistanceToNow(japanTime, { addSuffix: true, locale: ja });
  // 5
  const displayTime = differenceInDays(new Date(), japanTime) >= 3 ? formattedTime : relativeTime;

  return displayTime;
};

export default useFormattedTime;

/*
@          @@          @@          @@          @@          @@          @@          @@          @
================================================================================================
2
utcToZonedTime
与えられたUTCの日時を指定されたタイムゾーンに変換するdate-fns-tzの関数です。
第一引数に変換したいUTCの日時を、第二引数にタイムゾーンを受け取ります。
タイムゾーンはIANAタイムゾーンデータベースの形式（例: 'Asia/Tokyo'）で指定します。
変換された日時はローカルのタイムゾーンに基づいて返されます

================================================================================================
3
format
date-fnsの関数であり、日時を指定した形式に整形するために使用されます。
第一引数に整形したい日時を、第二引数に整形のパターンを受け取ります。
パターンは指定した形式に基づいて、年、月、日、時刻などを表現するために使用されます。

================================================================================================
4
formatDistanceToNow
指定した日時から現在までの相対的な時間を表す文字列を生成します。
------------------------------------------------------------------------------------------------
引数 japanTime は比較する日時の値です。これは日本時間に変換されたUTC時間です。
引数 options はオプションの設定を含むオブジェクトです。{ addSuffix: true, locale: ja } は具体的な設定を指定
しています。
------------------------------------------------------------------------------------------------
{ addSuffix: true, locale: ja }
addSuffix: true は相対的な時間表記において、現在の日時を基準として「何分前」「何時間前」「何日前」といった表現に
するための設定です。
locale: ja は日本語ロケールを使用して相対的な時間を表現するための設定です。これにより、出力される文字列が日本語に
なります。

================================================================================================
5
differenceInDays
2つの日時の間の日数の差を計算します。
引数 dateLeft は比較の基準となる日時の値です。
引数 dateRight は比較される日時の値です。
------------------------------------------------------------------------------------------------
differenceInDays(new Date(), japanTime) >= 3 ? formattedTime : relativeTime;
現在の日時と japanTime の間の日数差が3日以上かどうかを判定しています。
条件式が真であれば、formattedTime（"yyyy/MM/dd" 形式の日付）が代入されます。
条件式が偽であれば、relativeTime（相対的な時間表記）が代入されます。
------------------------------------------------------------------------------------------------
このコードでは、投稿の作成日時と現在の日時の間の日数差を計算し、その差が3日以上かどうかによって表示する日時の形式を
切り替えています。
差が3日以上の場合は formattedTime（"yyyy/MM/dd" 形式の日付）が表示され、それ以外の場合は relativeTime（相対
的な時間表記）が表示されます。
このようにして、3日以上前の投稿には具体的な日付が表示され、それ以降の投稿には相対的な時間が表示されるようになってい
ます。
*/
