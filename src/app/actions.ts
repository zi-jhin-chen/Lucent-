'use server';

import {
  aiOutfitVisualizer,
  type AiOutfitVisualizerInput,
} from "@/ai/flows/ai-outfit-visualizer";
import {
  identityExpressionAlignment,
  type IdentityExpressionAlignmentInput,
} from "@/ai/flows/identity-expression-alignment";
import {
  seasonalContentCompass,
  type SeasonalContentCompassInput,
} from "@/ai/flows/seasonal-content-compass";
import {
  analyzeStyle,
  type AnalyzeStyleInput,
} from "@/ai/flows/style-insight-engine";

export async function runAnalyzeStyle(input: AnalyzeStyleInput) {
  try {
    const result = await analyzeStyle(input);
    return { success: true, data: result };
  } catch (error) {
    console.error(error);
    return { success: false, error: "風格分析失敗。" };
  }
}

export async function runIdentityAlignment(
  input: IdentityExpressionAlignmentInput
) {
  try {
    const result = await identityExpressionAlignment(input);
    return { success: true, data: result };
  } catch (error) {
    console.error(error);
    return { success: false, error: "執行一致性檢查失敗。" };
  }
}

export async function runSeasonalContentCompass(
  input: SeasonalContentCompassInput
) {
  try {
    const result = await seasonalContentCompass(input);
    return { success: true, data: result };
  } catch (error) {
    console.error(error);
    return { success: false, error: "取得內容建議失敗。" };
  }
}

export async function runAiOutfitVisualizer(input: AiOutfitVisualizerInput) {
  try {
    const result = await aiOutfitVisualizer(input);
    return { success: true, data: result };
  } catch (error) {
    console.error(error);
    return { success: false, error: "穿搭模擬失敗。" };
  }
}
