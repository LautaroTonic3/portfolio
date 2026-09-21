/**
 * Se ejecuta antes de pintar la página: elige el tema según la
 * preferencia guardada o, si no hay, según la hora local (06:00–18:59 = día).
 */
export default function ThemeScript() {
  const code = `(function(){try{var s=localStorage.getItem('theme');var h=new Date().getHours();var t=s||((h>=6&&h<19)?'day':'night');document.documentElement.dataset.theme=t;}catch(e){document.documentElement.dataset.theme='night';}})();`;
  return <script dangerouslySetInnerHTML={{ __html: code }} />;
}
