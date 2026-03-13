/**
 * YouTubeデータ収集係 クラス
 */
const YouTubeClient = {
  
  // 動画IDから最新のコメントを取得する
  getLatestComments: function(videoId, maxResults = 3) {
    try {
      const response = YouTube.CommentThreads.list('snippet', {
        videoId: videoId,
        maxResults: maxResults,
        order: 'time'
      });
      
      // 扱いやすいように「必要なデータだけ」を整理して配列で返す
      return response.items.map(item => {
        const snippet = item.snippet.topLevelComment.snippet;
        return {
          id: item.snippet.topLevelComment.id, // コメント固有ID
          author: snippet.authorDisplayName,
          authorId: snippet.authorChannelId.value,
          text: snippet.textDisplay,
          publishedAt: snippet.publishedAt
        };
      });
      
    } catch (e) {
      console.error("YouTubeデータ取得失敗: " + e.message);
      return []; // エラー時は空のリストを返してプログラムを止めない
    }
  }
};