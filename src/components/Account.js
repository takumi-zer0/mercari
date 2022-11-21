import { useState, useEffect } from "react";

function Account(props) {
	const [accountData, setAccountData] = useState({
		email: "",
		password: "",
		secondPassword: "",
	});

	const handleSubmit = (e) => {
		e.preventDefault();
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
				className="flex flex-col gap-2 m-2"
			>
				<div className="flex gap-2 items-center">
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
						className="w-full rounded-md h-14 flex justify-between px-2 items-center"
					/>
				</div>
				<div className="flex gap-2 items-center">
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
						className="w-full rounded-md h-14 flex justify-between px-2 items-center"
					/>
				</div>
				<div className="flex gap-2 items-center">
					<h2 className="w-44">第二認証</h2>
					<input
						type="password"
						value={accountData.secondPassword}
						onChange={(e) => {
							setAccountData({
								...accountData,
								secondPassword: e.target.value,
							});
						}}
						className="w-full rounded-md h-14 flex justify-between px-2 items-center"
					/>
				</div>
				<button
					type="submit"
					className="bg-blue-500 text-white rounded-md h-14 flex justify-center items-center"
				>
					保存
				</button>
			</form>
		</div>
	);
}

export default Account;
