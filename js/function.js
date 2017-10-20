 //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

 function validOffert(polo,trt,walletPolo,walletTrt){

               for(var i = 0; i < 4; i ++){
                    var trtBidsPrice = trt.bids[i].price;
                    var trtAsksPrice = trt.asks[i].price ;
                    var trtAsksAmount = trt.asks[i].amount ;
                    var trtBidsAmount = trt.bids[i].amount;
                    var poloBidsPrice =  parseFloat(polo.bids[i][0]);
                    var poloBidsAmount = polo.bids[i][1];
                    var poloPrice =  parseFloat(polo.asks[i][0]);
                    /**
                         Se comprare su trt e vendere su polo è maggiore di comprare su polo e vendere su trt
                         allora compra su trt e vende su polo
                    **/
                    if(poloPrice - trtBidsPrice > trtAsksPrice - poloBidsPrice)
                    {
                         /**
                              se i dollari del portafoglio dove compro non è 0 e i btc del poortafoglio dove vendo non è 0
                              allora posso valutare le offerte
                         **/
                         if(walletTrt.usd > 0 && walletPolo.btc > 0){
                              /**
                                   se l'lofferta di buy è valida per i miei portafogli
                                   allora calcolo il profit e se il profit esiste eseguo le transazioni
                              **/
                              if(trtBidsPrice * trtBidsAmount < walletTrt.usd && trtBidsAmount < walletPolo.btc){          
                                        calculateProfitAmountAskTrtPolo(poloPrice,trtBidsAmount,trtBidsPrice,walletPolo,walletTrt);
                                   }else{     
                                      /**
                                             altrimenti faccio un'fferta con il massimo che mi consentono di fare i miei portafogli
                                       **/  
                                        calculateProfitAmountWalletTrtPolo(poloPrice,trtBidsAmount,trtBidsPrice,walletPolo,walletTrt);
                                   }
                              }else{                               
                                   /**
                                        controlla cosa è valorizzato a 0 e lo rivalorizza.
                                   **/
                                   if(walletTrt.usd == 0){
                                        var temProfit = walletTrt.btc - 1;
                                        //per ogni offerta sull'orderbook dei sell(ask) di trt controllo l'amount
                                        for(var i = 0; i < 4; i ++){

                                             if (trtAsksAmount < temProfit){
                                                  var offert = trtAsksAmount * trtAsksPrice;
                                                  var fee = (offert/100) * 0.2;
                                                  var profit = offert - fee;
                                                  walletTrt.btc = walletTrt.btc - trtAsksAmount;
                                                  walletTrt.usd = walletTrt.usd + profit; 
                                             }
                                        }
                                        //se l'amount dell'offerta è sufficiente per il mio wallet = temProfit
                                        //allora vendo quell'amoount di btc a quel prezzo. SOLO SE il prezzo a cui vendo è >= dell'ultimo buy
                                   }
                                   if(walletPolo.btc == 0){

                                        var temProfit = walletPolo.usd - 2000;
                                        walletPolo.usd = walletPolo.usd - temProfit;
                                        walletPolo.btc = walletPolo.btc + (temProfit * poloBidsPrice); 
                                   }
                              }
                         }else{
                                  if(poloBidsPrice * poloBidsAmount < walletTrt.usd){
                                        calculateProfitAmountAskPoloTrt(trtAsksPrice,poloBidsAmount,poloBidsPrice,walletPolo,walletTrt);
                                   }else{
                                        calculateProfitAmountWalletPoloTrt(trtAsksPrice,poloBidsAmount,poloBidsPrice,walletPolo,walletTrt);
                                        }
                                   }  
                          }
                }

     //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

     //PUNTO DI RICEZIONE DEI DATI DI ENTRAMBI GLI EXCHANGE
     function compareExchanges(arbitraggio,walletPolo,walletTrt){
          if(arbitraggio.data.poloprice != null && arbitraggio.data.trtprice != null)
          {
               validOffert(arbitraggio.data.poloprice,arbitraggio.data.trtprice,walletPolo,walletTrt);
          }
     }

     //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

     function calculateProfitAmountAskTrtPolo(poloPrice,trtBidsAmount,trtBidsPrice,walletPolo,walletTrt){

          var PoloOffert = poloPrice * trtBidsAmount;
          var TrtOffert = trtBidsPrice * trtBidsAmount; 
          var feePolo = (PoloOffert / 100) * 0.2; 
          var feeTrt = (TrtOffert / 100) * 0.2;
          var totFees = feePolo + feeTrt
          var profit = PoloOffert - TrtOffert - totFees;
               if (profit > 0){
                    //compare
                    walletTrt.usd = walletTrt.usd - TrtOffert;
                    walletTrt.btc = walletTrt.btc + trtBidsAmount;
                    walletPolo.usd = walletPolo.usd + (poloPrice * trtBidsAmount);
                    walletPolo.btc = walletPolo.btc - trtBidsAmount;
                    html.innerHTML = 'compro su trt e vendo su polo';
                    console.log(walletTrt);
                    console.log(walletPolo);
               }
      }

     //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

     //Stesso metodo ma per un'offerta con un amount limitato
     function calculateProfitAmountWalletTrtPolo(poloPrice,trtBidsAmount,trtBidsPrice,walletPolo,walletTrt){

          maxQuantityToBuy = walletTrt.usd / trtBidsPrice;
          //compra maxUqantiity to buy
          var PoloOffert = poloPrice * maxQuantityToBuy;
          var TrtOffert = trtBidsPrice * maxQuantityToBuy; 
          var feePolo = (PoloOffert / 100) * 0.2; 
          var feeTrt = (TrtOffert / 100) * 0.2;
          var totFees = feePolo + feeTrt
          var profit = PoloOffert - TrtOffert - totFees;
          if (profit > 0 && maxQuantityToBuy < walletPolo.btc){
               //compare
               walletTrt.usd = walletTrt.usd -TrtOffert;
               walletTrt.btc = walletTrt.btc + maxQuantityToBuy;
               walletPolo.usd = walletPolo.usd + (poloPrice * maxQuantityToBuy);
               walletPolo.btc = walletPolo.btc - maxQuantityToBuy;
               html.innerHTML = 'compro su trt e vendo su polo';
               console.log(walletTrt);
               console.log(walletPolo);
          }
           return profit;
}

     //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

     function calculateProfitAmountAskPoloTrt(trtAsksPrice,poloBidsAmount,poloBidsPrice,walletPolo,walletTrt){

          var PoloOffert = poloBidsPrice * poloBidsAmount;
          var TrtOffert = trtAsksPrice * poloBidsAmount; 
          var feePolo = (PoloOffert / 100) * 0.2; 
          var feeTrt = (TrtOffert / 100) * 0.2;
          var totFees = feePolo + feeTrt
          var profit = PoloOffert - TrtOffert - totFees;
          if (profit > 0){
                    //compare
                    walletTrt.usd = walletTrt.usd + TrtOffert;
                    walletTrt.btc = walletTrt.btc - poloBidsAmount;
                    walletPolo.usd = walletPolo.usd - (poloBidsPrice * poloBidsAmount);
                    walletPolo.btc = walletPolo.btc + poloBidsAmount;
                    html.innerHTML = 'compro su polo e vendo su trt';
                    console.log(walletTrt);
                    console.log(walletPolo);
               }
          }

     //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

     function calculateProfitAmountWalletPoloTrt(trtAsksPrice,poloBidsAmount,poloBidsPrice,walletPolo,walletTrt){
            //imposto la quantità massima da comprare per il mio portafoglio
          maxQuantityToBuy = walletPolo.usd / poloBidsPrice;
                                                  //compra maxUqantiity to buy
          var PoloOffert = poloBidsPrice * maxQuantityToBuy;
          var TrtOffert = trtAsksPrice * maxQuantityToBuy; 
          var feePolo = (PoloOffert / 100) * 0.2; 
          var feeTrt = (TrtOffert / 100) * 0.2;
          var totFees = feePolo + feeTrt
          var profit = PoloOffert - TrtOffert - totFees;
          if (profit > 0){
          //compare
               walletTrt.usd = walletTrt.usd + TrtOffert;
               walletTrt.btc = walletTrt.btc - maxQuantityToBuy;
               walletPolo.usd = walletPolo.usd - (poloBidsPrice * maxQuantityToBuy);
               walletPolo.btc = walletPolo.btc + maxQuantityToBuy;
               html.innerHTML = 'compro su polo e vendo su trt';
               console.log(walletTrt);
               console.log(walletPolo);
          }
}