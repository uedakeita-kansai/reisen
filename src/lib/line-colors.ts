const LINE_COLORS = {
  A: '#ec6e65', 
  S: '#b0bf1e', 
  I: '#006ab8', 
  E: '#ce045b', 
  SA: '#e095c6',
  NT: '#73c2fb',
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