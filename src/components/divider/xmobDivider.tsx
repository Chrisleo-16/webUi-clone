export default function XmobDivider({ color = "gray-200", lineWidth = "w-full", rotate = "0" }) {
    return (
        <div 
            className={`${lineWidth} h-0.5 bg-${color} dark:bg-${color} mt-3`} 
            style={{ transform: `rotate(${rotate}deg)` }}
        ></div>
    );
}
