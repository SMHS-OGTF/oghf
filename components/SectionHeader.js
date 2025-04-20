// COMPONENT
export default function SectionHeader({ children, topSpace = true}) {
    return <h3 
        className={`${topSpace ? "mt-8" : "" } mb-2 text-xl text-uiDark border-uiDark border-b-2 relative w-full`}
    >
        {children}
    </h3>
}