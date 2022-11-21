function Screen(props) {
	return (
		<div className="w-[80vw] bg-slate-100 p-5 flex flex-col">
			<h1 className="text-2xl">マッチした商品一覧</h1>
			<div className="my-2">
				<p>クリックするとメルカリの商品ページに移動します。</p>
				<p>
					最大50件まで保存します。それ以降は一番古い商品から削除されていきます。
				</p>
			</div>
			<div className="flex flex-col gap-2 m-2">
				<Row />
				<Row />
				<Row />
				<Row />
				<Row />
				<Row />
			</div>
		</div>
	);
}

function Row() {
	return (
		<div className="bg-white w-full rounded-md h-14 flex justify-between px-10 items-center hover:bg-slate-300 hover:cursor-pointer">
			<div>商品名</div>
			<div>ID</div>
			<div>リンク</div>
		</div>
	);
}

export default Screen;
