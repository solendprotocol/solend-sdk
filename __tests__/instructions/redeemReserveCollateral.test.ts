import { redeemReserveCollateralInstruction } from "../../src";
import { LendingInstruction } from "../../src/instructions/instruction";
import { TOKEN_PROGRAM_ID } from "@solana/spl-token";
import { PublicKey, TransactionInstruction } from "@solana/web3.js";
import BN from "bn.js";
import * as BufferLayout from "buffer-layout";
import * as Layout from "../../src/utils/layout";


describe("redeem reserve collateral", () => {

    const collateralAmount = new BN(120_340_560_789);
    const sourceCollateral = new PublicKey("AzqYUWKG5kqXgNwCvnuKdF8nRNBsJvbLK6NpTzWJtxHr");
    const destinationLiquidity = new PublicKey("JD5VXSwNmTatjqJEALW1v1ixoNM7JV4mnVF4h96KpBC6");
    const reserve = new PublicKey("64oqP1dFqqD8NEL4RPCpMyrHmpo31rj3nYxULVXvayfW");
    const reserveCollateralMint = new PublicKey("HJLTaDvwcyHvLbvme81E2BtyxsURfazo34anUwTZDc3W");
    const reserveLiquiditySupply = new PublicKey("Port7uDYB3wk6GJAw4KT1WpTeMtSu9bTcChBHkX2LfR");
    const lendingMarket = new PublicKey("9xQeWvG816bUx9EPjHmaT23yvVM2ZWbrrpZb9PusVFin");
    const lendingMarketAuthority = new PublicKey("6hWf9DXxUu9cjSw63mnyrkrpXinxiQ1BogFRPskpoNNh");
    const transferAuthority = new PublicKey("76pWmCRuVqHKsPSUph5X7xQ6bZho3apXXEdSNvr11Yvx");
    const solendProgramAddress = new PublicKey("So1endDq2YkqhipRh3WViPa8hdiSpxWy6z3Z6tMCpAo");

    const txnIxs = redeemReserveCollateralInstruction(
        collateralAmount,
        sourceCollateral,
        destinationLiquidity,
        reserve,
        reserveCollateralMint,
        reserveLiquiditySupply,
        lendingMarket,
        lendingMarketAuthority,
        transferAuthority,
        solendProgramAddress
    );

    const dataLayout = BufferLayout.struct([
        BufferLayout.u8("instruction"),
        Layout.uint64("collateralAmount"),
    ]);


    it("should create a valid redeem reserve collateral instruction", () => {
        expect(txnIxs).toBeInstanceOf(TransactionInstruction);
        expect(txnIxs).toHaveProperty("programId", solendProgramAddress);
        expect(txnIxs).toHaveProperty("keys");
        expect(txnIxs).toHaveProperty("data");
    });

    it("returned instruction should have correct program id", () => {
        expect(txnIxs.programId).toBeInstanceOf(PublicKey);
        expect(txnIxs.programId).toEqual(solendProgramAddress);
    });

    it("returned instruction should have correct keys", () => {
        expect(txnIxs.keys).toHaveLength(9);
        expect(txnIxs.keys).toContainEqual({ pubkey: sourceCollateral, isSigner: false, isWritable: true });
        expect(txnIxs.keys).toContainEqual({ pubkey: destinationLiquidity, isSigner: false, isWritable: true });
        expect(txnIxs.keys).toContainEqual({ pubkey: reserve, isSigner: false, isWritable: true });
        expect(txnIxs.keys).toContainEqual({ pubkey: reserveCollateralMint, isSigner: false, isWritable: true });
        expect(txnIxs.keys).toContainEqual({ pubkey: reserveLiquiditySupply, isSigner: false, isWritable: true });
        expect(txnIxs.keys).toContainEqual({ pubkey: lendingMarket, isSigner: false, isWritable: false });
        expect(txnIxs.keys).toContainEqual({ pubkey: lendingMarketAuthority, isSigner: false, isWritable: false });
        expect(txnIxs.keys).toContainEqual({ pubkey: transferAuthority, isSigner: true, isWritable: false });
        expect(txnIxs.keys).toContainEqual({ pubkey: TOKEN_PROGRAM_ID, isSigner: false, isWritable: false });
    });

    it("returned instruction should have correct data", () => {
        const data = Buffer.alloc(dataLayout.span);
        dataLayout.encode(
            {
                instruction: LendingInstruction.RedeemReserveCollateral,
                collateralAmount: new BN(collateralAmount),
            },
            data
        );

        expect(txnIxs.data).toBeInstanceOf(Uint8Array);
        expect(txnIxs.data).toEqual(data);
        expect(dataLayout.decode(txnIxs.data).instruction).toBe(LendingInstruction.RedeemReserveCollateral);
        expect(dataLayout.decode(txnIxs.data).collateralAmount).toBeInstanceOf(BN);
        expect(dataLayout.decode(txnIxs.data).collateralAmount.toNumber()).toEqual(collateralAmount.toNumber());
    });

    it("should work with Number as well as BN", () => {
        const collateralAmountNumber = 1234; // Number instead of BN
        const anotherTxnIxs = redeemReserveCollateralInstruction(
            collateralAmountNumber,
            sourceCollateral,
            destinationLiquidity,
            reserve,
            reserveCollateralMint,
            reserveLiquiditySupply,
            lendingMarket,
            lendingMarketAuthority,
            transferAuthority,
            solendProgramAddress
        );

        const data = Buffer.alloc(dataLayout.span);
        dataLayout.encode(
            {
                instruction: LendingInstruction.RedeemReserveCollateral,
                collateralAmount: new BN(collateralAmountNumber),
            },
            data
        );

        expect(dataLayout.decode(anotherTxnIxs.data).collateralAmount).toBeInstanceOf(BN);
        expect(dataLayout.decode(anotherTxnIxs.data).collateralAmount.toNumber()).toEqual(collateralAmountNumber);
    });
});
