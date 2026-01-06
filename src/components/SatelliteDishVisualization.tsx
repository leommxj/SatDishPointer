import React, { useRef, useEffect, useCallback } from 'react';
import { Language, getTranslation } from '../i18n/translations';

interface SatelliteDishVisualizationProps {
  azimuth?: number;
  elevation?: number;
  polarization?: number;
  isActualElevation?: boolean;
  antennaType?: 'offset' | 'prime_focus';
  language?: Language;
}

const SatelliteDishVisualization: React.FC<SatelliteDishVisualizationProps> = ({
  azimuth,
  elevation,
  polarization,
  isActualElevation = false,
  antennaType,
  language = 'zh'
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const t = getTranslation(language);

  // 绘制仰角视图（左上）
  const drawElevation = useCallback((
    ctx: CanvasRenderingContext2D,
    x: number, y: number, w: number, h: number,
    scale: number
  ) => {
    const centerX = x + w / 2;
    const centerY = y + h * 0.55;
    const arrowLength = Math.min(w, h) * 0.35;

    const titleFontSize = Math.max(10, Math.round(13 * scale));
    const valueFontSize = Math.max(11, Math.round(14 * scale));
    const smallFontSize = Math.max(8, Math.round(10 * scale));

    // 标题
    ctx.fillStyle = '#374151';
    ctx.font = `bold ${titleFontSize}px sans-serif`;
    ctx.textAlign = 'center';
    ctx.fillText(t.sideViewElevation, centerX, y + 20 * scale);

    // 地平线
    ctx.strokeStyle = '#9ca3af';
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    ctx.moveTo(centerX - arrowLength * 1.3, centerY);
    ctx.lineTo(centerX + arrowLength * 1.3, centerY);
    ctx.stroke();
    ctx.setLineDash([]);

    // 地面标记
    ctx.fillStyle = '#6b7280';
    ctx.font = `${smallFontSize}px sans-serif`;
    ctx.textAlign = 'left';
    ctx.fillText(t.horizon, centerX - arrowLength * 1.2, centerY + 12 * scale);

    // 垂直轴
    ctx.strokeStyle = '#d1d5db';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(centerX, centerY - arrowLength * 1.2);
    ctx.lineTo(centerX, centerY + arrowLength * 0.3);
    ctx.stroke();

    if (elevation !== undefined) {
      const elevRad = elevation * Math.PI / 180;

      // 仰角弧线
      ctx.beginPath();
      ctx.arc(centerX, centerY, arrowLength * 0.5, 0, -elevRad, elevation > 0);
      ctx.strokeStyle = '#3b82f6';
      ctx.lineWidth = 2;
      ctx.stroke();

      // 仰角数值
      ctx.fillStyle = '#2563eb';
      ctx.font = `bold ${valueFontSize}px sans-serif`;
      ctx.textAlign = 'center';
      const labelText = isActualElevation ? t.actualElevation : t.elevation;
      ctx.fillText(`${labelText}: ${elevation.toFixed(1)}°`, centerX, y + 38 * scale);

      // 仰角箭头
      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.rotate(-elevRad);

      ctx.strokeStyle = '#ef4444';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(arrowLength, 0);
      ctx.stroke();

      // 箭头头部
      const arrowHeadSize = Math.max(5, 7 * scale);
      ctx.beginPath();
      ctx.moveTo(arrowLength, 0);
      ctx.lineTo(arrowLength - arrowHeadSize, -arrowHeadSize * 0.7);
      ctx.lineTo(arrowLength - arrowHeadSize, arrowHeadSize * 0.7);
      ctx.closePath();
      ctx.fillStyle = '#ef4444';
      ctx.fill();

      ctx.restore();
    }
  }, [elevation, isActualElevation, t]);

  // 绘制方位角视图（右上）
  const drawAzimuth = useCallback((
    ctx: CanvasRenderingContext2D,
    x: number, y: number, w: number, h: number,
    scale: number
  ) => {
    const centerX = x + w / 2;
    const centerY = y + h * 0.55;
    const compassRadius = Math.min(w, h) * 0.32;

    const titleFontSize = Math.max(10, Math.round(13 * scale));
    const valueFontSize = Math.max(11, Math.round(14 * scale));
    const labelFontSize = Math.max(8, Math.round(10 * scale));

    // 标题
    ctx.fillStyle = '#374151';
    ctx.font = `bold ${titleFontSize}px sans-serif`;
    ctx.textAlign = 'center';
    ctx.fillText(t.topViewAzimuth, centerX, y + 20 * scale);

    // 罗盘圆
    ctx.beginPath();
    ctx.arc(centerX, centerY, compassRadius, 0, 2 * Math.PI);
    ctx.strokeStyle = '#e5e7eb';
    ctx.lineWidth = 1;
    ctx.stroke();

    // 十字线
    ctx.strokeStyle = '#d1d5db';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(centerX, centerY - compassRadius);
    ctx.lineTo(centerX, centerY + compassRadius);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(centerX - compassRadius, centerY);
    ctx.lineTo(centerX + compassRadius, centerY);
    ctx.stroke();

    // 方向标签
    ctx.fillStyle = '#6b7280';
    ctx.font = `${labelFontSize}px sans-serif`;
    const labelOffset = compassRadius + 8 * scale;

    ctx.textAlign = 'center';
    ctx.textBaseline = 'bottom';
    ctx.fillText(t.north, centerX, centerY - labelOffset);
    ctx.textBaseline = 'top';
    ctx.fillText(t.south, centerX, centerY + labelOffset);
    ctx.textBaseline = 'middle';
    ctx.textAlign = 'left';
    ctx.fillText(t.east, centerX + labelOffset, centerY);
    ctx.textAlign = 'right';
    ctx.fillText(t.west, centerX - labelOffset, centerY);
    ctx.textBaseline = 'alphabetic';

    if (azimuth !== undefined) {
      // 方位角数值
      ctx.fillStyle = '#dc2626';
      ctx.font = `bold ${valueFontSize}px sans-serif`;
      ctx.textAlign = 'center';
      ctx.fillText(`${t.azimuth}: ${azimuth.toFixed(1)}°`, centerX, y + 38 * scale);

      const azimuthRad = (azimuth - 90) * Math.PI / 180;

      // 方位箭头
      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.rotate(azimuthRad);

      ctx.strokeStyle = '#ef4444';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(compassRadius * 0.85, 0);
      ctx.stroke();

      // 箭头头部
      const arrowHeadSize = Math.max(5, 7 * scale);
      ctx.beginPath();
      ctx.moveTo(compassRadius * 0.85, 0);
      ctx.lineTo(compassRadius * 0.85 - arrowHeadSize, -arrowHeadSize * 0.7);
      ctx.lineTo(compassRadius * 0.85 - arrowHeadSize, arrowHeadSize * 0.7);
      ctx.closePath();
      ctx.fillStyle = '#ef4444';
      ctx.fill();

      ctx.restore();
    }
  }, [azimuth, t]);

  // 绘制参数汇总（左下）
  const drawSummary = useCallback((
    ctx: CanvasRenderingContext2D,
    x: number, y: number, w: number, h: number,
    scale: number
  ) => {
    const titleFontSize = Math.max(10, Math.round(13 * scale));
    const valueFontSize = Math.max(10, Math.round(12 * scale));
    const padding = 15 * scale;
    const lineHeight = 22 * scale;

    // 标题
    ctx.fillStyle = '#374151';
    ctx.font = `bold ${titleFontSize}px sans-serif`;
    ctx.textAlign = 'center';
    ctx.fillText(t.paramsSummary, x + w / 2, y + 20 * scale);

    if (azimuth === undefined && elevation === undefined) {
      ctx.fillStyle = '#9ca3af';
      ctx.font = `${valueFontSize}px sans-serif`;
      ctx.textAlign = 'center';
      ctx.fillText(t.waitingResult, x + w / 2, y + h / 2);
      return;
    }

    // 参数列表
    ctx.font = `${valueFontSize}px sans-serif`;
    ctx.textAlign = 'left';
    let currentY = y + 45 * scale;

    if (azimuth !== undefined) {
      ctx.fillStyle = '#374151';
      ctx.fillText(`${t.azimuth}:`, x + padding, currentY);
      ctx.fillStyle = '#dc2626';
      ctx.textAlign = 'right';
      ctx.fillText(`${azimuth.toFixed(2)}°`, x + w - padding, currentY);
      ctx.textAlign = 'left';
      currentY += lineHeight;
    }

    if (elevation !== undefined) {
      ctx.fillStyle = '#374151';
      const elevLabel = isActualElevation ? t.actualElevation : t.elevation;
      ctx.fillText(`${elevLabel}:`, x + padding, currentY);
      ctx.fillStyle = '#2563eb';
      ctx.textAlign = 'right';
      ctx.fillText(`${elevation.toFixed(2)}°`, x + w - padding, currentY);
      ctx.textAlign = 'left';
      currentY += lineHeight;
    }

    if (polarization !== undefined) {
      ctx.fillStyle = '#374151';
      ctx.fillText(`${t.polarization}:`, x + padding, currentY);
      ctx.fillStyle = '#059669';
      ctx.textAlign = 'right';
      const polarText = polarization >= 0 ? `+${polarization.toFixed(2)}°` : `${polarization.toFixed(2)}°`;
      ctx.fillText(polarText, x + w - padding, currentY);
    }
  }, [azimuth, elevation, polarization, isActualElevation, t]);

  // 绘制极化角视图（右下）
  const drawPolarization = useCallback((
    ctx: CanvasRenderingContext2D,
    x: number, y: number, w: number, h: number,
    scale: number
  ) => {
    const centerX = x + w / 2;
    const centerY = y + h * 0.55;
    const polarRadius = Math.min(w, h) * 0.3;

    const titleFontSize = Math.max(10, Math.round(13 * scale));
    const valueFontSize = Math.max(11, Math.round(14 * scale));

    // 标题
    ctx.fillStyle = '#374151';
    ctx.font = `bold ${titleFontSize}px sans-serif`;
    ctx.textAlign = 'center';
    ctx.fillText(t.polarization, centerX, y + 20 * scale);

    // 刻度盘
    ctx.beginPath();
    ctx.arc(centerX, centerY, polarRadius, 0, 2 * Math.PI);
    ctx.strokeStyle = '#e5e7eb';
    ctx.lineWidth = 1;
    ctx.stroke();

    // 基准线（水平）
    ctx.strokeStyle = '#9ca3af';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(centerX - polarRadius * 1.1, centerY);
    ctx.lineTo(centerX + polarRadius * 1.1, centerY);
    ctx.stroke();

    if (polarization !== undefined) {
      // 极化角数值
      const polarColor = polarization > 0 ? '#3b82f6' : (polarization < 0 ? '#ef4444' : '#059669');
      ctx.fillStyle = polarColor;
      ctx.font = `bold ${valueFontSize}px sans-serif`;
      ctx.textAlign = 'center';
      const polarText = polarization >= 0 ? `+${polarization.toFixed(1)}°` : `${polarization.toFixed(1)}°`;
      ctx.fillText(polarText, centerX, y + 38 * scale);

      // 旋转弧线（当极化角不为0时）
      if (Math.abs(polarization) > 0.5) {
        const arcRadius = polarRadius * 0.4;
        const arcEnd = polarization * Math.PI / 180;
        const isClockwise = polarization > 0;

        ctx.beginPath();
        ctx.arc(centerX, centerY, arcRadius, 0, arcEnd, !isClockwise);
        ctx.strokeStyle = polarColor;
        ctx.lineWidth = 2;
        ctx.stroke();

        // 弧线箭头
        const arrowSize = Math.max(4, 5 * scale);
        const arrowX = centerX + arcRadius * Math.cos(arcEnd);
        const arrowY = centerY + arcRadius * Math.sin(arcEnd);

        ctx.save();
        ctx.translate(arrowX, arrowY);
        ctx.rotate(arcEnd + (isClockwise ? Math.PI / 2 : -Math.PI / 2));
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(-arrowSize, -arrowSize * 0.6);
        ctx.lineTo(-arrowSize, arrowSize * 0.6);
        ctx.closePath();
        ctx.fillStyle = polarColor;
        ctx.fill();
        ctx.restore();
      }

      // 极化指示线
      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.rotate(polarization * Math.PI / 180);

      ctx.strokeStyle = '#059669';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(-polarRadius * 0.8, 0);
      ctx.lineTo(polarRadius * 0.8, 0);
      ctx.stroke();

      // 双向箭头
      const arrowSize = Math.max(4, 5 * scale);
      ctx.fillStyle = '#059669';
      ctx.beginPath();
      ctx.moveTo(polarRadius * 0.8, 0);
      ctx.lineTo(polarRadius * 0.7, -arrowSize);
      ctx.lineTo(polarRadius * 0.7, arrowSize);
      ctx.closePath();
      ctx.fill();
      ctx.beginPath();
      ctx.moveTo(-polarRadius * 0.8, 0);
      ctx.lineTo(-polarRadius * 0.7, -arrowSize);
      ctx.lineTo(-polarRadius * 0.7, arrowSize);
      ctx.closePath();
      ctx.fill();

      ctx.restore();
    } else {
      ctx.fillStyle = '#9ca3af';
      ctx.font = `${valueFontSize}px sans-serif`;
      ctx.textAlign = 'center';
      ctx.fillText('--', centerX, y + 38 * scale);
    }
  }, [polarization, t]);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const container = canvas.parentElement;
    if (!container) return;

    // 高清屏支持
    const dpr = window.devicePixelRatio || 1;
    const width = container.clientWidth;
    const height = container.clientHeight;

    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    ctx.scale(dpr, dpr);

    // 清空画布
    ctx.clearRect(0, 0, width, height);

    // 计算缩放因子
    const scale = Math.max(0.6, Math.min(1, Math.min(width, height) / 400));

    // 绘制背景网格
    ctx.strokeStyle = '#f3f4f6';
    ctx.lineWidth = 1;
    const gridSize = 25 * scale;
    for (let gx = 0; gx < width; gx += gridSize) {
      ctx.beginPath();
      ctx.moveTo(gx, 0);
      ctx.lineTo(gx, height);
      ctx.stroke();
    }
    for (let gy = 0; gy < height; gy += gridSize) {
      ctx.beginPath();
      ctx.moveTo(0, gy);
      ctx.lineTo(width, gy);
      ctx.stroke();
    }

    // 计算四个区域（2x2布局）
    const halfW = width / 2;
    const halfH = height / 2;
    const gap = 2;

    // 绘制分割线
    ctx.strokeStyle = '#e5e7eb';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(halfW, 0);
    ctx.lineTo(halfW, height);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(0, halfH);
    ctx.lineTo(width, halfH);
    ctx.stroke();

    // 绘制四个区域
    drawElevation(ctx, gap, gap, halfW - gap * 2, halfH - gap * 2, scale);
    drawAzimuth(ctx, halfW + gap, gap, halfW - gap * 2, halfH - gap * 2, scale);
    drawSummary(ctx, gap, halfH + gap, halfW - gap * 2, halfH - gap * 2, scale);
    drawPolarization(ctx, halfW + gap, halfH + gap, halfW - gap * 2, halfH - gap * 2, scale);

  }, [drawElevation, drawAzimuth, drawSummary, drawPolarization]);

  useEffect(() => {
    draw();

    const handleResize = () => draw();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [draw]);

  return (
    <div className="w-full h-full relative flex flex-col">
      <h3 className="text-lg font-semibold mb-2 flex-shrink-0">{t.visualization}</h3>
      <div className="flex-1 relative min-h-0">
        <canvas ref={canvasRef} className="absolute inset-0" />
      </div>
    </div>
  );
};

export default SatelliteDishVisualization;
