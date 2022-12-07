function Menu({ status, currentMenu, setCurrentMenu }) {
	return (
		<div className="w-[20vw] bg-blue-800 px-5 py-5 flex flex-col gap-5">
			{status == "online" ? (
				<div className="text-green-500 font-bold text-xl tracking-wider pb-5 border-b">
					🟢 稼働中
				</div>
			) : (
				<div className="text-red-500 font-bold text-xl tracking-wider pb-5 border-b">
					🔴 停止中
				</div>
			)}

			<div className="flex flex-col">
				<button
					onClick={() => {
						setCurrentMenu("search");
					}}
					className="text-white w-full text-left hover:bg-gray-300/40 px-3 py-2"
				>
					検索
				</button>
				<button
					onClick={() => {
						setCurrentMenu("list");
					}}
					className="text-white w-full text-left hover:bg-gray-300/40 px-3 py-2"
				>
					商品一覧
				</button>
				<button
					onClick={() => {
						setCurrentMenu("account");
					}}
					className="text-white w-full text-left hover:bg-gray-300/40 px-3 py-2"
				>
					アカウント
				</button>
			</div>
		</div>
	);
}
export default Menu;
