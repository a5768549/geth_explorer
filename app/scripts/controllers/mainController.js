function getBlock(web3, index) {
    block = web3.eth.getBlock(index);
    block.timestamp = block.timestamp + "000";
    return block;
}
angular.module("ethExplorer").controller("mainCtrl", [
    "$rootScope",
    "$scope",
    "$interval",
    "$location",
    function ($rootScope, $scope, $interval, $location) {
        var web3 = $rootScope.web3;
        var maxBlocks = 100; // TODO: into setting file or user select
        var blockNumMax = ($scope.blockNum = parseInt(web3.eth.blockNumber, 10));
        if (maxBlocks > blockNumMax) {
            maxBlocks = blockNumMax;
        }
        var lastBlockNum = blockNumMax - maxBlocks;

        // get latest 50 blocks
        $scope.blocks = [];
        for (var i = lastBlockNum; i <= blockNumMax; ++i) {
            $scope.blocks.unshift(getBlock(web3, i));
            lastBlockNum = i;
        }

        stop = $interval(function () {
            blockNumMax = $scope.blockNum = parseInt(web3.eth.blockNumber, 10);
            if (lastBlockNum < blockNumMax) {
                for (var i = lastBlockNum + 1; i <= blockNumMax; ++i) {
                    $scope.blocks.unshift(getBlock(web3, i));
                    lastBlockNum = i;
                    if ($scope.blocks.length > maxBlocks) $scope.blocks.pop();
                }
            }
        }, 7 * 1000);

        $scope.$on("$destroy", function () {
            if (angular.isDefined(stop)) {
                $interval.cancel(stop);
                stop = undefined;
            }
        });
        $scope.processRequest = function () {
            var requestStr = $scope.ethRequest.split("0x").join("");

            if (requestStr.length === 40) return goToAddrInfos(requestStr);
            else if (requestStr.length === 64) {
                if (/[0-9a-zA-Z]{64}?/.test(requestStr)) return goToTxInfos(requestStr);
                else if (/[0-9]{1,7}?/.test(requestStr)) return goToBlockInfos(requestStr);
            } else if (parseInt(requestStr) > 0) return goToBlockInfos(parseInt(requestStr));

            alert("Don't know how to handle " + requestStr);
        };

        function goToBlockInfos(requestStr) {
            $location.path("/block/" + requestStr);
        }

        function goToAddrInfos(requestStr) {
            $location.path("/address/" + requestStr);
        }

        function goToTxInfos(requestStr) {
            $location.path("/transaction/" + requestStr);
        }
    },
]);

function decodeData(data) {
    // TODO: move this a service
    // TODO: how could we read ABIs generated by truffle? (build/contracts )
    abiDecoder.addABI([
        {
            constant: true,
            inputs: [{ name: "_roundId", type: "uint256" }],
            name: "getWinnablePot",
            outputs: [{ name: "_winnablePot", type: "uint256" }],
            payable: false,
            type: "function",
        },
        {
            constant: true,
            inputs: [],
            name: "latestRoundId",
            outputs: [{ name: "_roundId", type: "uint256" }],
            payable: false,
            type: "function",
        },
        {
            constant: false,
            inputs: [{ name: "_new", type: "address" }],
            name: "setOwner",
            outputs: [],
            payable: false,
            type: "function",
        },
        {
            constant: true,
            inputs: [],
            name: "getGameInfo",
            outputs: [
                { name: "_roundsCount", type: "uint256" },
                { name: "_latestRoundId", type: "uint256" },
                { name: "_nextRoundLength", type: "uint256" },
                { name: "_nextRoundRequiredBetAmount", type: "uint256" },
                { name: "_nextRoundFee", type: "uint256" },
            ],
            payable: false,
            type: "function",
        },
        {
            constant: false,
            inputs: [{ name: "forceClose", type: "bool" }],
            name: "checkAndCloseRound",
            outputs: [{ name: "result", type: "int16" }],
            payable: false,
            type: "function",
        },
        {
            constant: false,
            inputs: [
                { name: "queryId", type: "bytes32" },
                { name: "result", type: "string" },
            ],
            name: "__callback",
            outputs: [],
            payable: false,
            type: "function",
        },
        {
            constant: false,
            inputs: [
                { name: "myid", type: "bytes32" },
                { name: "result", type: "string" },
                { name: "proof", type: "bytes" },
            ],
            name: "__callback",
            outputs: [],
            payable: false,
            type: "function",
        },
        {
            constant: true,
            inputs: [
                { name: "roundId", type: "uint256" },
                { name: "value", type: "uint256" },
            ],
            name: "verifyBet",
            outputs: [{ name: "result", type: "uint8" }],
            payable: false,
            type: "function",
        },
        {
            constant: false,
            inputs: [
                { name: "roundId", type: "uint256" },
                { name: "encryptedBet", type: "string" },
            ],
            name: "placeBet",
            outputs: [{ name: "queryId", type: "bytes32" }],
            payable: true,
            type: "function",
        },
        {
            constant: true,
            inputs: [{ name: "roundId", type: "uint256" }],
            name: "getRequiredBetAmount",
            outputs: [{ name: "ret", type: "uint256" }],
            payable: false,
            type: "function",
        },
        {
            constant: true,
            inputs: [{ name: "_dataSource", type: "string" }],
            name: "getOraclizePrice",
            outputs: [{ name: "", type: "uint256" }],
            payable: false,
            type: "function",
        },
        {
            constant: true,
            inputs: [{ name: "roundId", type: "uint256" }],
            name: "getRoundInfo",
            outputs: [
                { name: "_isActive", type: "bool" },
                { name: "_requiredBetAmount", type: "uint256" },
                { name: "_revealTime", type: "uint256" },
                { name: "_roundLength", type: "uint256" },
                { name: "_betCount", type: "uint256" },
                { name: "_revealedBetCount", type: "uint256" },
                { name: "_unReveleadBetCount", type: "uint256" },
                { name: "_winningAddress", type: "address" },
                { name: "_smallestNumber", type: "uint256" },
                { name: "_winnablePot", type: "uint256" },
                { name: "_fee", type: "uint256" },
            ],
            payable: false,
            type: "function",
        },
        {
            constant: false,
            inputs: [{ name: "_nextRoundRequiredBetAmount", type: "uint256" }],
            name: "setNextRoundRequiredBetAmount",
            outputs: [],
            payable: false,
            type: "function",
        },
        {
            constant: true,
            inputs: [],
            name: "owner",
            outputs: [{ name: "", type: "address" }],
            payable: false,
            type: "function",
        },
        {
            constant: true,
            inputs: [{ name: "_roundId", type: "uint256" }],
            name: "getFeeAmount",
            outputs: [{ name: "_feeAmount", type: "uint256" }],
            payable: false,
            type: "function",
        },
        {
            constant: false,
            inputs: [],
            name: "startNewRound",
            outputs: [{ name: "newRoundId", type: "uint256" }],
            payable: false,
            type: "function",
        },
        {
            constant: true,
            inputs: [
                { name: "roundId", type: "uint256" },
                { name: "playerAddress", type: "address" },
            ],
            name: "getBet",
            outputs: [
                { name: "_didBet", type: "bool" },
                { name: "_betNumber", type: "uint256" },
                { name: "_didWin", type: "bool" },
            ],
            payable: false,
            type: "function",
        },
        {
            constant: true,
            inputs: [{ name: "_roundId", type: "uint256" }],
            name: "getTotalPot",
            outputs: [{ name: "_totalPot", type: "uint256" }],
            payable: false,
            type: "function",
        },
        {
            constant: false,
            inputs: [{ name: "_nextRoundLength", type: "uint256" }],
            name: "setNextRoundLength",
            outputs: [],
            payable: false,
            type: "function",
        },
        {
            constant: false,
            inputs: [{ name: "_nextRoundFee", type: "uint32" }],
            name: "setNextRoundFee",
            outputs: [],
            payable: false,
            type: "function",
        },
        { inputs: [], payable: true, type: "constructor" },
        { payable: true, type: "fallback" },
        {
            anonymous: false,
            inputs: [
                { indexed: true, name: "_roundId", type: "uint256" },
                { indexed: true, name: "_from", type: "address" },
                { indexed: false, name: "_queryId", type: "bytes32" },
            ],
            name: "e_betPlaced",
            type: "event",
        },
        {
            anonymous: false,
            inputs: [
                { indexed: true, name: "_roundId", type: "uint256" },
                { indexed: true, name: "_from", type: "address" },
                { indexed: false, name: "_queryId", type: "bytes32" },
                { indexed: false, name: "_betNumber", type: "uint256" },
            ],
            name: "e_betRevealed",
            type: "event",
        },
        {
            anonymous: false,
            inputs: [
                { indexed: true, name: "_roundId", type: "uint256" },
                { indexed: false, name: "_winnerAddress", type: "address" },
                { indexed: false, name: "_winningNumber", type: "uint256" },
                { indexed: false, name: "_numberOfBets", type: "uint256" },
                { indexed: false, name: "_numberOfUnRevealedBets", type: "uint256" },
                { indexed: false, name: "_numberOfInvalidBets", type: "uint256" },
            ],
            name: "e_roundClosed",
            type: "event",
        },
        {
            anonymous: false,
            inputs: [
                { indexed: true, name: "_roundId", type: "uint256" },
                { indexed: false, name: "_requiredBetAmount", type: "uint256" },
                { indexed: false, name: "_revealTime", type: "uint256" },
            ],
            name: "e_roundStarted",
            type: "event",
        },
        {
            anonymous: false,
            inputs: [{ indexed: false, name: "_errorMsg", type: "string" }],
            name: "e_error",
            type: "event",
        },
        {
            anonymous: false,
            inputs: [
                { indexed: true, name: "_from", type: "address" },
                { indexed: false, name: "_amount", type: "uint256" },
            ],
            name: "e_fundsReceived",
            type: "event",
        },
        {
            anonymous: false,
            inputs: [
                { indexed: true, name: "_roundId", type: "uint256" },
                { indexed: false, name: "_settingName", type: "string" },
                { indexed: false, name: "_oldValue", type: "uint256" },
                { indexed: false, name: "_newValue", type: "uint256" },
            ],
            name: "e_settingChange",
            type: "event",
        },
        {
            anonymous: false,
            inputs: [
                { indexed: true, name: "old", type: "address" },
                { indexed: true, name: "current", type: "address" },
            ],
            name: "NewOwner",
            type: "event",
        },
    ]);
    var decoded = abiDecoder.decodeMethod(data);
    return JSON.stringify(decoded, null, 4);
} // decodeData(data)
