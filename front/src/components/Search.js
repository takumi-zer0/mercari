import { useState, useEffect } from "react";
import axios from "axios";

function Search(props) {
	const [searchData, setSearchData] = useState({
		searchWord: "",
		include: [],
		exclude: [],
		include: [],
		minPrice: "",
		maxPrice: "",
		autoBuy: false,
	});

	const [excludeTemp, setExcludeTemp] = useState("");
	const [includeTemp, setIncludeTemp] = useState("");

	useEffect(() => {
		// separate excludeTemp by ,
		let temp = excludeTemp.split(",");
		// remove empty strings
		temp = temp.filter((item) => item != "");
		temp = temp.map((item) => item.trim());

		console.log(temp, "temot");

		// separate includeTemp by ,
		let temp2 = includeTemp.split(",");
		// remove empty strings
		temp2 = temp2.filter((item) => item != "");
		// remove spaces
		temp2 = temp2.map((item) => item.trim());
		setSearchData({
			...searchData,
			include: temp2 || [],
			exclude: temp || [],
		});
	}, [excludeTemp, includeTemp]);

	const handleSubmit = (e) => {
		e.preventDefault();
		console.log(searchData);

		let send = {
			searchWord: searchData.searchWord,
			minPrice: searchData.minPrice || 0,
			maxPrice: searchData.maxPrice || 1000000,
			include: searchData.include || [],
			exclude: searchData.exclude || [],
			autoBuy: searchData.autoBuy,
		};

		axios.post("/api/settings", send).then((res) => {
			console.log(res);
			alert("OK");
		});
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
				className="flex flex-col m-2 gap-2"
			>
				<div className="flex items-center gap-2">
					<h2 className="w-44">検索商品名</h2>
					<input
						type="text"
						value={searchData.searchWord}
						onChange={(e) => {
							setSearchData({
								...searchData,
								searchWord: e.target.value,
							});
						}}
						className="flex items-center justify-between w-full px-2 rounded-md h-14"
					/>
				</div>
				<div className="flex items-center gap-2">
					<h2 className="w-44">抽出キーワード</h2>
					<input
						type="text"
						value={includeTemp}
						onChange={(e) => {
							setIncludeTemp(e.target.value);
						}}
						className="flex items-center justify-between w-full px-2 rounded-md h-14"
					/>
				</div>
				<div className="flex items-center gap-2">
					<h2 className="w-44">除外キーワード</h2>
					<input
						type="text"
						value={excludeTemp}
						onChange={(e) => {
							setExcludeTemp(e.target.value);
						}}
						className="flex items-center justify-between w-full px-2 rounded-md h-14"
					/>
				</div>
				<div className="flex items-start gap-2">
					<h2 className="pt-4 w-44">金額</h2>
					<div className="flex flex-col w-full gap-4">
						<div className="flex items-center gap-2">
							<input
								type="number"
								value={searchData.minPrice}
								onChange={(e) => {
									setSearchData({
										...searchData,
										minPrice: e.target.value,
									});
								}}
								className="flex items-center justify-between px-2 w-44 rounded-md h-14"
							/>
							<p>円以上</p>
						</div>
						<div className="flex items-center gap-2">
							<input
								type="number"
								value={searchData.maxPrice}
								onChange={(e) => {
									setSearchData({
										...searchData,
										maxPrice: e.target.value,
									});
								}}
								className="flex items-center justify-between px-2 w-44 rounded-md h-14"
							/>
							<p>円未満</p>
						</div>
					</div>
				</div>
				<div className="flex items-center gap-2">
					<h2 className="w-44">自動購入</h2>
					<input
						type="checkbox"
						checked={searchData.autoBuy}
						onChange={(e) => {
							setSearchData({
								...searchData,
								autoBuy: e.target.checked,
							});
						}}
						className="flex items-center justify-between w-5 px-2 rounded-md h-14"
					/>
				</div>
				<div className="flex items-center justify-center w-full gap-4">
					<button
						type="submit"
						className="flex items-center justify-center text-white bg-red-500 rounded-md h-14 w-44 hover:bg-red-800"
					>
						停止
					</button>
					<button
						type="submit"
						className="flex items-center justify-center text-white bg-blue-500 rounded-md h-14 w-44 hover:bg-blue-800"
					>
						稼働
					</button>
				</div>
			</form>
		</div>
	);
}

export default Search;
