import { useState, useEffect } from "react";

function Search(props) {
	const [searchData, setSearchData] = useState({
		search: "",
		exclude: [],
		minPrice: "",
		maxPrice: "",
		enableAutoBuy: false,
	});

	const [excludeTemp, setExcludeTemp] = useState("");

	const handleSubmit = (e) => {
		e.preventDefault();
		console.log(searchData);
	};

	return (
		<div className="w-[80vw] bg-slate-100 p-5 flex flex-col">
			<h1 className="text-2xl">検索設定画面</h1>
			<div className="my-2">
				<p></p>
			</div>
			<form
				onSubmit={(e) => {
					handleSubmit(e);
				}}
				className="flex flex-col gap-2 m-2"
			>
				<div className="flex gap-2 items-center">
					<h2 className="w-44">検索商品名</h2>
					<input
						type="text"
						value={searchData.search}
						onChange={(e) => {
							setSearchData({
								...searchData,
								search: e.target.value,
							});
						}}
						className="w-full rounded-md h-14 flex justify-between px-2 items-center"
					/>
				</div>
				<div className="flex gap-2 items-center">
					<h2 className="w-44">除外キーワード</h2>
					<input
						type="text"
						value={excludeTemp}
						onChange={(e) => {
							setExcludeTemp(e.target.value);
						}}
						className="w-full rounded-md h-14 flex justify-between px-2 items-center"
					/>
				</div>
				<div className="flex gap-2 items-start">
					<h2 className="w-44 pt-4">金額</h2>
					<div className="flex flex-col gap-4 w-full">
						<div className="flex gap-2 items-center">
							<input
								type="number"
								value={searchData.minPrice}
								onChange={(e) => {
									setSearchData({
										...searchData,
										minPrice: e.target.value,
									});
								}}
								className="w-44 rounded-md h-14 flex justify-between px-2 items-center"
							/>
							<p>円以上</p>
						</div>
						<div className="flex gap-2 items-center">
							<input
								type="number"
								value={searchData.maxPrice}
								onChange={(e) => {
									setSearchData({
										...searchData,
										maxPrice: e.target.value,
									});
								}}
								className="w-44 rounded-md h-14 flex justify-between px-2 items-center"
							/>
							<p>円未満</p>
						</div>
					</div>
				</div>
				<div className="flex gap-2 items-center">
					<h2 className="w-44">自動購入</h2>
					<input
						type="checkbox"
						checked={searchData.enableAutoBuy}
						onChange={(e) => {
							setSearchData({
								...searchData,
								enableAutoBuy: e.target.checked,
							});
						}}
						className="w-5 rounded-md h-14 flex justify-between px-2 items-center"
					/>
				</div>
				<div className="w-full items-center justify-center gap-4 flex">
					<button
						type="submit"
						className="bg-red-500 text-white rounded-md h-14 flex justify-center items-center w-44 hover:bg-red-800"
					>
						停止
					</button>
					<button
						type="submit"
						className="bg-blue-500 text-white rounded-md h-14 flex justify-center items-center w-44 hover:bg-blue-800"
					>
						稼働
					</button>
				</div>
			</form>
		</div>
	);
}

export default Search;
