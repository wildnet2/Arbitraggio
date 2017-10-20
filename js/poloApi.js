//pusher poloniex


//USDT_BTC
function socketPolo(arbitraggio,walletPolo,walletTrt){
	var wsuri = "wss://api.poloniex.com";
	var connection = new autobahn.Connection({
		url: wsuri,
		realm: "realm1"
	});
	var data = {};
	data.arbitraggio = arbitraggio;
	data.walletTrt = walletTrt;
	data.walletPolo = walletPolo;
		//APRO CONNESSIONE CON SOCKET POLO
		connection.open();
		connection.onopen = function (session) {
			function marketEvent (args,kwargs) {
						//chiamata ajax orderbook poloniex
						$.ajax({
							type: 'GET',
							async: false,
							url: "https://poloniex.com/public?command=returnOrderBook&currencyPair=USDT_BTC&depth=10",
							data: "",
							success: function(data) {arbitraggio.data.poloprice  = data;
							compareExchanges(this.arbitraggio,this.walletPolo,this.walletTrt); 
						}.bind(this)
					});	
					}		
			//DEFINISCO IL TIPO DI CHIAMATA AL SOCKET
			session.subscribe('USDT_BTC', marketEvent.bind(this));
		}.bind(data);
		connection.onclose = function () {
			console.log("Websocket connection closed");
		}
	};

//pusher poloniex
//BTC_ETH

function socketPoloETH(){
	var wsuri = "wss://api.poloniex.com";
	var connection = new autobahn.Connection({
		url: wsuri,
		realm: "realm1"
	});
		//APRO CONNESSIONE CON SOCKET POLO
		connection.open();
		connection.onopen = function (session) {
			function marketEvent (args,kwargs) {
						//chiamata ajax orderbook poloniex
						$.ajax({
							type: 'GET',
							async: false,
							url: "https://poloniex.com/public?command=returnOrderBook&currencyPair=BTC_ETH&depth=10",
							data: "",
							success: function(data) {arbitraggio.data.poloprice  = data;
								compareExchanges();
							}
						});	
					}		
			//DEFINISCO IL TIPO DI CHIAMATA AL SOCKET
			session.subscribe('USDT_BTC', marketEvent);
		}
		connection.onclose = function () {
			console.log("Websocket connection closed");
		}
	};



//pusher poloniex

//BTC_LTC

function socketPoloLTC(){
	var wsuri = "wss://api.poloniex.com";
	var connection = new autobahn.Connection({
		url: wsuri,
		realm: "realm1"
	});
		//APRO CONNESSIONE CON SOCKET POLO
		connection.open();
		connection.onopen = function (session) {
			function marketEvent (args,kwargs) {
						//chiamata ajax orderbook poloniex
						$.ajax({
							type: 'GET',
							async: false,
							url: "https://poloniex.com/public?command=returnOrderBook&currencyPair=BTC_LTC&depth=10",
							data: "",
							success: function(data) {arbitraggio.data.poloprice  = data;
								compareExchanges();
							}
						});	
					}		
			//DEFINISCO IL TIPO DI CHIAMATA AL SOCKET
			session.subscribe('USDT_BTC', marketEvent);
		}
		connection.onclose = function () {
			console.log("Websocket connection closed");
		}
	};
