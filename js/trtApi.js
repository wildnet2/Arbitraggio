//APRO CONNESSIONE SPCKET TRT

	//pusher trt
	//BTC
	function socketTrtBTCUSD(arbitraggio,walletPolo,walletTrt){
		var pusher = new Pusher('bb1fafdf79a00453b5af');
		var order_book_channel = pusher.subscribe('BTCUSD');
		var data = {};
		data.arbitraggio = arbitraggio;
		data.walletTrt = walletTrt;
		data.walletPolo = walletPolo;

	//elaborate data for trt after push
	order_book_channel.bind('orderbook', 
		function(data,walletPolo,walletTrt) {
			arbitraggio.data.trtprice = data;
			compareExchanges(this.arbitraggio,this.walletPolo,this.walletTrt);
		}.bind(data)
	);
};

	//ETH
	function socketTrtBTCETH(arbitraggio){
		var pusher = new Pusher('bb1fafdf79a00453b5af');
		var order_book_channel = pusher.subscribe('BTCETH');
	//elaborate data for trt after push
	order_book_channel.bind('orderbook', function(data) {
		arbitraggio.data.trtprice = data;
		compareExchanges();
	});
};

	//LTC

	function socketTrtBTCLTC(arbitraggio){
		var pusher = new Pusher('bb1fafdf79a00453b5af');
		var order_book_channel = pusher.subscribe('BTCLTC');
	//elaborate data for trt after push
	order_book_channel.bind('orderbook', function(data) {
		arbitraggio.data.trtprice = data;
		compareExchanges();
	});
};

