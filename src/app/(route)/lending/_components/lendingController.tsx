import { Card } from "@/app/_components/Common/Card";
import classNames from "classnames";
import { useState } from "react";
import { Token } from "../page";
import { useBalance } from "wagmi";

import {
    cdpContractAbi,
    cdpContractAddress,
} from "@/app/_contract/cdpContract";

import { useReadContract, useWriteContract } from "wagmi";

interface ToggleSwitchProps {
    isSupply: boolean;
    setIsSupply: (value: boolean) => void;
}

const ToggleSwitch = ({ isSupply, setIsSupply }: ToggleSwitchProps) => {
    return (
        <div className="flex flex-row items-center justify-start rounded-[20px] h-[40px] w-full">
            <div
                className={classNames(
                    "flex flex-row items-center justify-center rounded-[20px] h-[40px] w-1/2 duration-150",
                    {
                        "bg-point text-white": isSupply,
                        "bg-white text-point cursor-pointer hover:bg-primary": !isSupply,
                    },
                )}
                onClick={() => {
                    setIsSupply(true);
                }}
            >
                Supply
            </div>
            <div
                className={classNames(
                    "flex flex-row items-center justify-center rounded-[20px] h-[40px] w-1/2 duration-150",
                    {
                        "bg-point text-white": !isSupply,
                        "bg-white text-point cursor-pointer hover:bg-primary": isSupply,
                    },
                )}
                onClick={() => {
                    setIsSupply(false);
                }}
            >
                Borrow{" "}
            </div>
        </div>
    );
};

interface ControllerProps {
    isSupply: boolean;
    setIsSupply: (value: boolean) => void;
    selectedToken: Token;
}

export const LendingController = ({
    isSupply,
    setIsSupply,
    selectedToken,
}: ControllerProps) => {
    // TODO : get user balance from wallet
    const userBalance = 1213;

    const { writeContract } = useWriteContract();

    const openCdpPosition = () => {
        writeContract(
            {
                abi: cdpContractAbi,
                address: "0x585c82f7DAc53263800b59D276d573ef87Af8119",
                functionName: "open",
                args: [],
            },
            {
                onSuccess: (txHash) => {
                    console.log(txHash);
                },
                onSettled: (txHash) => {
                    console.log(txHash);
                },
                onError(error, variables, context) {
                    console.log(error, variables, context);
                },
            },
        );
    };

    const [amount, setAmount] = useState(0);

    const openCdpPositions = [
        { id: '1', token: 'ETH', balance: '2.0' },
        { id: '5', token: 'DAI', balance: '1000' }
    ];

    const [selectedPositions, setSelectedPositions] = useState<string[]>([]);

    const handleSelectPosition = (id: string) => {
        setSelectedPositions(prev => {
            if (prev.includes(id)) {
                return prev.filter(item => item !== id); // Deselect
            } else {
                return [...prev, id]; // Select
            }
        });
    };


    return (
        <div className="flex flex-col w-1/3 justify-start items-start gap-5">
            <Card className="flex flex-col justify-start items-start w-full p-2">
                <ToggleSwitch isSupply={isSupply} setIsSupply={setIsSupply} />
                <div className="text-2024  py-3">Supply {selectedToken}</div>
                <div className="mt-4 mb-2">Select your already Open CDP Positions:</div>
                <ul className="list-disc pl-5 mb-4">
                    {openCdpPositions.map((position) => (
                        <li key={position.id} className="flex items-center">
                            <input
                                type="checkbox"
                                className="mr-2"
                                checked={selectedPositions.includes(position.id)}
                                onChange={() => handleSelectPosition(position.id)}
                            />
                            {`${position.id}: ${position.balance}`}
                        </li>
                    ))}
                </ul>
                <div className="p-6 w-full h-[150px] bg-[#CACACA] flex flex-col gap-5 justify-center items-center">
                    <div className="flex flex-row justify-between items-center w-full">
                        <div>$PRICE</div>
                        <div>{userBalance}</div>
                    </div>

                    <div className="flex flex-row justify-between items-center w-full">
                        <input
                            type="number"
                            className="px-5 text-start outline-none rounded-lg border-none bg-[#CACACA] w-3/4 h-10"
                            value={amount}
                            onChange={(e) => {
                                setAmount(parseInt(e.target.value));
                            }}
                            placeholder="enter amounts"
                        />
                        <div className="flex flex-row h-8 justify-center items-center gap-2">
                            <div
                                className="bg-blue-800 text-white cursor-pointer rounded-xl px-2 py-1"
                                onClick={() => {
                                    setAmount(userBalance);
                                }}
                            >
                                MAX
                            </div>
                            <div> {selectedToken} </div>
                        </div>
                    </div>
                    <div className="w-full">
                        <input
                            type="range"
                            value={(amount / userBalance) * 100}
                            onChange={(e) => {
                                setAmount((parseInt(e.target.value) * userBalance) / 100);
                            }}
                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
                        />
                    </div>
                </div>
                <button className="bg-point text-white rounded-[30px] w-full h-[60px]" onClick={() => {
                    openCdpPosition();
                }}>
                    Open and Deposit
                </button>
            </Card>
        </div>
    );
};

