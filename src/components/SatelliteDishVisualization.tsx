import React, { useRef, useEffect } from 'react';
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
  antennaType = 'offset',
  language = 'zh'
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const t = getTranslation(language);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // 设置画布尺寸
    const resizeCanvas = () => {
      const container = canvas.parentElement;
      if (container) {
        canvas.width = container.clientWidth;
        canvas.height = container.clientHeight;
      }
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // 清空画布
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // 根据画布尺寸计算缩放因子
    const minDimension = Math.min(canvas.width, canvas.height);
    const scale = Math.max(0.5, Math.min(1, minDimension / 500));

    // 动态字体大小
    const titleFontSize = Math.max(10, Math.round(14 * scale));
    const labelFontSize = Math.max(9, Math.round(12 * scale));
    const smallFontSize = Math.max(8, Math.round(10 * scale));
    const valueFontSize = Math.max(11, Math.round(16 * scale));

    // 判断是否为小屏幕模式
    const isSmallScreen = canvas.width < 500 || canvas.height < 350;
    const isVerySmallScreen = canvas.width < 400 || canvas.height < 300;

    // 绘制网格背景
    ctx.strokeStyle = '#f3f4f6';
    ctx.lineWidth = 1;
    const gridSize = Math.max(20, 30 * scale);
    for (let x = 0; x < canvas.width; x += gridSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvas.height);
      ctx.stroke();
    }
    for (let y = 0; y < canvas.height; y += gridSize) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvas.width, y);
      ctx.stroke();
    }

    // 分割线
    ctx.strokeStyle = '#e5e7eb';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(canvas.width / 2, 30 * scale);
    ctx.lineTo(canvas.width / 2, canvas.height - 30 * scale);
    ctx.stroke();

    // 左侧：侧视图（仰角视图）
    const leftCenterX = canvas.width / 4;
    const leftCenterY = canvas.height * 0.4;
    const arrowLength = Math.min(canvas.width / 4, canvas.height / 3) * 0.5;

    // 标题
    ctx.fillStyle = '#374151';
    ctx.font = `bold ${titleFontSize}px sans-serif`;
    ctx.textAlign = 'center';
    ctx.fillText(t.sideViewElevation, leftCenterX, 25 * scale);

    // 地平线
    ctx.strokeStyle = '#9ca3af';
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    ctx.moveTo(leftCenterX - arrowLength * 1.5, leftCenterY);
    ctx.lineTo(leftCenterX + arrowLength * 1.5, leftCenterY);
    ctx.stroke();
    ctx.setLineDash([]);

    // 地面标记
    ctx.fillStyle = '#6b7280';
    ctx.font = `${smallFontSize}px sans-serif`;
    ctx.textAlign = 'left';
    ctx.fillText(t.horizon, leftCenterX - arrowLength * 1.4, leftCenterY + 15 * scale);

    // 画坐标轴
    ctx.strokeStyle = '#d1d5db';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(leftCenterX, leftCenterY - arrowLength * 1.5);
    ctx.lineTo(leftCenterX, leftCenterY + arrowLength * 0.5);
    ctx.stroke();

    if (elevation !== undefined) {
      const elevRad = elevation * Math.PI / 180;

      // 仰角弧线
      ctx.beginPath();
      ctx.arc(leftCenterX, leftCenterY, arrowLength * 0.6, 0, -elevRad, elevation > 0);
      ctx.strokeStyle = '#3b82f6';
      ctx.lineWidth = 2;
      ctx.stroke();

      // 仰角数值
      ctx.fillStyle = '#2563eb';
      ctx.font = `bold ${valueFontSize}px sans-serif`;
      ctx.textAlign = 'center';
      const labelText = isActualElevation ? t.actualElevation : t.elevation;
      ctx.fillText(`${labelText}: ${elevation.toFixed(1)}°`, leftCenterX, leftCenterY - arrowLength * 1.7);

      // 绘制仰角箭头
      ctx.save();
      ctx.translate(leftCenterX, leftCenterY);
      ctx.rotate(-elevRad);

      ctx.strokeStyle = '#ef4444';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(arrowLength * 1.2, 0);
      ctx.stroke();

      // 箭头头部
      const arrowHeadSize = Math.max(5, 8 * scale);
      ctx.beginPath();
      ctx.moveTo(arrowLength * 1.2, 0);
      ctx.lineTo(arrowLength * 1.1, -arrowHeadSize);
      ctx.lineTo(arrowLength * 1.1, arrowHeadSize);
      ctx.closePath();
      ctx.fillStyle = '#ef4444';
      ctx.fill();

      ctx.restore();

      // 标注角度（仅在非小屏幕且角度足够大时显示）
      if (!isVerySmallScreen && Math.abs(elevation) > 10) {
        const labelRadius = arrowLength * 0.8;
        const labelX = leftCenterX + labelRadius * Math.cos(-elevRad / 2);
        const labelY = leftCenterY + labelRadius * Math.sin(-elevRad / 2);
        ctx.fillStyle = '#3b82f6';
        ctx.font = `${smallFontSize}px sans-serif`;
        ctx.textAlign = 'center';
        ctx.fillText(`${elevation.toFixed(1)}°`, labelX, labelY);
      }
    }

    // 右侧：俯视图（方位角视图）
    const rightCenterX = (canvas.width * 3) / 4;
    const rightCenterY = canvas.height * 0.4;
    const compassRadius = arrowLength * 1.3;

    // 标题
    ctx.fillStyle = '#374151';
    ctx.font = `bold ${titleFontSize}px sans-serif`;
    ctx.textAlign = 'center';
    ctx.fillText(t.topViewAzimuth, rightCenterX, 25 * scale);

    // 方位指示（罗盘）
    ctx.beginPath();
    ctx.arc(rightCenterX, rightCenterY, compassRadius, 0, 2 * Math.PI);
    ctx.strokeStyle = '#e5e7eb';
    ctx.lineWidth = 1;
    ctx.stroke();

    // 绘制十字坐标轴（东西南北线）
    ctx.strokeStyle = '#d1d5db';
    ctx.lineWidth = 1;
    // 南北线（垂直）
    ctx.beginPath();
    ctx.moveTo(rightCenterX, rightCenterY - compassRadius);
    ctx.lineTo(rightCenterX, rightCenterY + compassRadius);
    ctx.stroke();
    // 东西线（水平）
    ctx.beginPath();
    ctx.moveTo(rightCenterX - compassRadius, rightCenterY);
    ctx.lineTo(rightCenterX + compassRadius, rightCenterY);
    ctx.stroke();

    // 方向标签 - 根据屏幕大小调整位置和显示
    ctx.fillStyle = '#6b7280';
    ctx.font = `${labelFontSize}px sans-serif`;
    ctx.textAlign = 'center';

    const labelOffset = compassRadius + 12 * scale;
    ctx.fillText(isSmallScreen ? t.north : `${t.north} (0°)`, rightCenterX, rightCenterY - labelOffset);
    ctx.textBaseline = 'middle';
    ctx.fillText(isSmallScreen ? t.south : `${t.south} (180°)`, rightCenterX, rightCenterY + labelOffset + 5);
    ctx.textAlign = 'left';
    ctx.fillText(isSmallScreen ? t.east : `${t.east} (90°)`, rightCenterX + labelOffset, rightCenterY);
    ctx.textAlign = 'right';
    ctx.fillText(isSmallScreen ? t.west : `${t.west} (270°)`, rightCenterX - labelOffset, rightCenterY);
    ctx.textBaseline = 'alphabetic';

    // 绘制45度方向（仅在非小屏幕时显示）
    if (!isSmallScreen) {
      const dirs = [
        { angle: 45, label: t.northeast },
        { angle: 135, label: t.southeast },
        { angle: 225, label: t.southwest },
        { angle: 315, label: t.northwest }
      ];

      ctx.fillStyle = '#9ca3af';
      ctx.font = `${smallFontSize}px sans-serif`;
      dirs.forEach(dir => {
        const rad = (dir.angle - 90) * Math.PI / 180;
        const x = rightCenterX + (compassRadius + 5) * Math.cos(rad);
        const y = rightCenterY + (compassRadius + 5) * Math.sin(rad);
        ctx.textAlign = dir.angle > 180 ? 'right' : 'left';
        ctx.fillText(dir.label, x, y);
      });
    }

    if (azimuth !== undefined) {
      // 方位角数值
      ctx.fillStyle = '#dc2626';
      ctx.font = `bold ${valueFontSize}px sans-serif`;
      ctx.textAlign = 'center';
      ctx.fillText(`${t.azimuth}: ${azimuth.toFixed(1)}°`, rightCenterX, rightCenterY - compassRadius - 25 * scale);

      const azimuthRad = (azimuth - 90) * Math.PI / 180;

      // 方位指示箭头
      ctx.save();
      ctx.translate(rightCenterX, rightCenterY);
      ctx.rotate(azimuthRad);

      ctx.strokeStyle = '#ef4444';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(arrowLength * 1.0, 0);
      ctx.stroke();

      // 箭头头部
      const arrowHeadSize = Math.max(5, 8 * scale);
      ctx.beginPath();
      ctx.moveTo(arrowLength * 1.0, 0);
      ctx.lineTo(arrowLength * 0.9, -arrowHeadSize);
      ctx.lineTo(arrowLength * 0.9, arrowHeadSize);
      ctx.closePath();
      ctx.fillStyle = '#ef4444';
      ctx.fill();

      ctx.restore();
    }

    // 底部区域：极化角和参数汇总
    const bottomAreaY = canvas.height * 0.75;

    // 极化角显示（仅在足够高度时显示）
    if (polarization !== undefined && canvas.height > 350 && !isVerySmallScreen) {
      const polarCenterX = (canvas.width * 3) / 4;
      const polarY = bottomAreaY;
      const polarLength = arrowLength * 0.6;

      // 标题
      ctx.fillStyle = '#374151';
      ctx.font = `bold ${titleFontSize}px sans-serif`;
      ctx.textAlign = 'center';
      ctx.fillText(t.polarization, polarCenterX, polarY - polarLength - 20 * scale);

      // 绘制圆形刻度盘
      ctx.beginPath();
      ctx.arc(polarCenterX, polarY, polarLength, 0, 2 * Math.PI);
      ctx.strokeStyle = '#e5e7eb';
      ctx.lineWidth = 1;
      ctx.stroke();

      // 绘制基准线（水平）- 实线更明显
      ctx.strokeStyle = '#9ca3af';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(polarCenterX - polarLength * 1.1, polarY);
      ctx.lineTo(polarCenterX + polarLength * 1.1, polarY);
      ctx.stroke();

      // 标注 - 0°在右侧
      if (!isSmallScreen) {
        ctx.fillStyle = '#6b7280';
        ctx.font = `${smallFontSize}px sans-serif`;
        ctx.textAlign = 'left';
        ctx.fillText('0°', polarCenterX + polarLength + 5, polarY + 4);
        ctx.textAlign = 'right';
        ctx.fillText('±180°', polarCenterX - polarLength - 5, polarY + 4);
      }

      // 绘制旋转方向弧形箭头（当极化角不为0时）
      if (Math.abs(polarization) > 0.5) {
        const arcRadius = polarLength * 0.4;
        const arcStart = 0; // 从0°开始
        const arcEnd = polarization * Math.PI / 180;
        const isClockwise = polarization > 0;

        // 绘制弧线
        ctx.beginPath();
        ctx.arc(polarCenterX, polarY, arcRadius, arcStart, arcEnd, !isClockwise);
        ctx.strokeStyle = isClockwise ? '#3b82f6' : '#ef4444';
        ctx.lineWidth = 2;
        ctx.stroke();

        // 绘制弧线末端箭头
        const arrowAngle = arcEnd;
        const arrowSize = Math.max(4, 6 * scale);
        const arrowX = polarCenterX + arcRadius * Math.cos(arrowAngle);
        const arrowY = polarY + arcRadius * Math.sin(arrowAngle);

        ctx.save();
        ctx.translate(arrowX, arrowY);
        // 箭头方向垂直于弧线
        ctx.rotate(arrowAngle + (isClockwise ? Math.PI / 2 : -Math.PI / 2));

        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(-arrowSize, -arrowSize * 0.6);
        ctx.lineTo(-arrowSize, arrowSize * 0.6);
        ctx.closePath();
        ctx.fillStyle = isClockwise ? '#3b82f6' : '#ef4444';
        ctx.fill();
        ctx.restore();
      }

      // 极化角指示线
      ctx.save();
      ctx.translate(polarCenterX, polarY);
      ctx.rotate(polarization * Math.PI / 180);

      ctx.strokeStyle = '#059669';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(-polarLength * 0.85, 0);
      ctx.lineTo(polarLength * 0.85, 0);
      ctx.stroke();

      // 极化方向箭头（双向）
      const polarArrowSize = Math.max(4, 5 * scale);
      ctx.fillStyle = '#059669';
      ctx.beginPath();
      ctx.moveTo(polarLength * 0.85, 0);
      ctx.lineTo(polarLength * 0.75, -polarArrowSize);
      ctx.lineTo(polarLength * 0.75, polarArrowSize);
      ctx.closePath();
      ctx.fill();

      ctx.beginPath();
      ctx.moveTo(-polarLength * 0.85, 0);
      ctx.lineTo(-polarLength * 0.75, -polarArrowSize);
      ctx.lineTo(-polarLength * 0.75, polarArrowSize);
      ctx.closePath();
      ctx.fill();

      ctx.restore();

      // 极化角数值（带正负号）
      const polarColor = polarization > 0 ? '#3b82f6' : (polarization < 0 ? '#ef4444' : '#059669');
      ctx.fillStyle = polarColor;
      ctx.font = `bold ${labelFontSize}px sans-serif`;
      ctx.textAlign = 'center';
      const polarText = polarization > 0 ? `+${polarization.toFixed(1)}°` : `${polarization.toFixed(1)}°`;
      ctx.fillText(polarText, polarCenterX, polarY + polarLength + 18 * scale);
    }

    // 参数汇总（左下角）
    if (azimuth !== undefined && elevation !== undefined) {
      const summaryX = canvas.width / 4;
      const summaryY = bottomAreaY;
      const boxWidth = Math.min(150, canvas.width / 4);
      const boxHeight = polarization !== undefined ? 70 * scale : 55 * scale;

      ctx.fillStyle = '#f9fafb';
      ctx.fillRect(summaryX - boxWidth / 2, summaryY - 25 * scale, boxWidth, boxHeight);

      ctx.strokeStyle = '#e5e7eb';
      ctx.lineWidth = 1;
      ctx.strokeRect(summaryX - boxWidth / 2, summaryY - 25 * scale, boxWidth, boxHeight);

      ctx.fillStyle = '#374151';
      ctx.font = `bold ${labelFontSize}px sans-serif`;
      ctx.textAlign = 'center';
      ctx.fillText(t.paramsSummary, summaryX, summaryY - 8 * scale);

      ctx.font = `${smallFontSize}px sans-serif`;
      ctx.textAlign = 'left';
      const leftX = summaryX - boxWidth / 2 + 8;
      const lineHeight = 13 * scale;
      ctx.fillText(`${t.azimuth}: ${azimuth.toFixed(1)}°`, leftX, summaryY + 8 * scale);
      const elevLabel = isActualElevation ? t.actualElevation : t.elevation;
      ctx.fillText(`${elevLabel}: ${elevation.toFixed(1)}°`, leftX, summaryY + 8 * scale + lineHeight);
      if (polarization !== undefined) {
        ctx.fillText(`${t.polarization}: ${polarization.toFixed(1)}°`, leftX, summaryY + 8 * scale + lineHeight * 2);
      }
    }

    // 清理
    return () => {
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [azimuth, elevation, polarization, isActualElevation, antennaType, language, t]);

  return (
    <div className="w-full h-full relative flex flex-col">
      <h3 className="text-lg font-semibold mb-2 flex-shrink-0">{t.visualization}</h3>
      <div className="flex-1 relative min-h-0">
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full"
        />
        {!azimuth && !elevation && (
          <div className="absolute inset-0 flex items-center justify-center">
            <p className="text-gray-500 bg-white/80 px-4 py-2 rounded">{t.waitingResult}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SatelliteDishVisualization;
