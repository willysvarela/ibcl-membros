
const TeensAnimation = () => {
    return (<div className="motion-preset-fade-lg motion-delay-300 flex justify-center items-center gap-10">
        <div className={`w-8 h-8 bg-red-500 rounded-full animate-bounce delay-75`}></div>
        <div className={`w-8 h-8 bg-blue-500 rounded-full animate-bounce delay-200`}></div>
        <div className={`w-8 h-8 bg-green-500 rounded-full animate-bounce delay-300`}></div>
        <div className={`w-8 h-8 bg-orange-500 rounded-full animate-bounce delay-500`}></div>
    </div>)
}

export default TeensAnimation