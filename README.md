# Geth_Explorer

![EthExplorer Screenshot](http://i.imgur.com/NHFYq0x.png)

## 授權(根據原作者授權)

原作者：https://github.com/etherparty/explorer/
GPL (see LICENSE)


## 安裝

如果你還沒安裝，安裝 [Git](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git "Git installation") 

Clone the repo

`git clone https://github.com/a5768549/geth_explorer`

如果你還沒安裝，下載 [Nodejs and npm](https://docs.npmjs.com/getting-started/installing-node "Nodejs install")

注意: 預設情況下，Geth_Explorer會連結localhost:8545。
如果您使用 `--rpcport` 更改預設port，那需要在app.js中更改設定。

開始執行，會自動下載所需套件。

`npm start`

然後瀏覽 http://localhost:8000 

若出現錯誤，請確保geth指令中帶有以下corsdomain設定
`geth --rpc --rpccorsdomain "http://localhost:8000"`

如果沒有安裝，安裝 [geth](https://github.com/ethereum/go-ethereum/wiki/Building-Ethereum "Geth install")

然後重整你的網頁

## Docker編譯

在當前目錄輸入以下指令：

`docker build -t {image名稱} . --no-cache`

## Docker運行

編譯完後，在當前目錄輸入以下指令：

```
$ docker run --name {container名稱} --rm -it -p 8000:8000 {image名稱}
```

或者使用線上image：

```
$ docker run --name {container名稱} --rm -it -p 8000:8000 a5768549/geth_explorer
```


