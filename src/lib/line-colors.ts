// 路線ごとの色を定義
const LINE_COLORS: { [key: string]: string } = {
  A: '#ec6e65', // 浅草線
  S: '#b0bf1e', // 新宿線
  I: '#006ab8', // 三田線
  E: '#ce045b', // 大江戸線
  SA: '#e095c6',// さくらトラム（都電荒川線）
  NT: '#73c2fb',// 日暮里・舎人ライナー
};

/**
 * 駅IDのプレフィックスから路線の色を取得する関数
 * @param stationId 駅ID (例: "S-01")
 * @returns 色のHEXコード (例: "#b0bf1e")
 */
export const getLineColor = (stationId: string): string => {
  const prefix = stationId.split('-')[0];
  return LINE_COLORS[prefix] || '#808080'; 
};