import { useState, useEffect } from "react";
import axios from "axios";

function Account(props) {
	const [accountData, setAccountData] = useState({
		email: "",
		password: "",
	});

	const handleSubmit = (e) => {
		e.preventDefault();
		axios
			.post(`http://${process.env.IP}/login`, accountData)
			.then((res) => {
				console.log(res, "login");
			});

		let phoneAuth1 = window.prompt("Enter your password");
		axios.post(`http://${process.env.IP}/phoneAuth1`, {
			phoneAuth1: phoneAuth1,
		});
	};

	return (
		<div className="w-[80vw] bg-slate-100 p-5 flex flex-col">
			<h1 className="text-2xl">アカウント設定</h1>
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
					<h2 className="w-44">メールアドレス</h2>
					<input
						type="text"
						value={accountData.email}
						onChange={(e) => {
							setAccountData({
								...accountData,
								email: e.target.value,
							});
						}}
						className="flex items-center justify-between w-full px-2 rounded-md h-14"
					/>
				</div>
				<div className="flex items-center gap-2">
					<h2 className="w-44">パスワード</h2>
					<input
						type="password"
						value={accountData.password}
						onChange={(e) => {
							setAccountData({
								...accountData,
								password: e.target.value,
							});
						}}
						className="flex items-center justify-between w-full px-2 rounded-md h-14"
					/>
				</div>
				<button
					type="submit"
					className="flex items-center justify-center text-white bg-blue-500 rounded-md h-14"
				>
					保存
				</button>
			</form>
		</div>
	);
}

export default Account;
