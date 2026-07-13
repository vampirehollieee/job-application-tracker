import { externalLinks } from "./config/externalLinks";

export function WebDemoNotice() {
  if (window.desktopAPI) return null;

  return (
    <section className="webDemoNotice" aria-label="瀏覽器試用版說明">
      <div>
        <h2>瀏覽器試用版</h2>
        <p>不用登入，可以直接操作。資料只會保存在目前使用的瀏覽器。</p>
        <small>
          網頁試用資料不會同步到 Windows 版。清除瀏覽器資料、更換裝置或使用無痕模式後，紀錄可能消失。
        </small>
      </div>
      <a
        className="primaryButton"
        href={externalLinks.windowsRelease}
        target="_blank"
        rel="noopener noreferrer"
      >
        下載 Windows 完整版
      </a>
    </section>
  );
}
