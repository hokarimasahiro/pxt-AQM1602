/**
 * makecode AQM1602 LCD Package.
 */

/**
 * AQM1602 block
 */
//% weight=10 color=#800000 icon="\uf26c" block="AQM1602"
namespace aqm1602 {
    let I2C_ADDR = 0x3e
    let initFlag: number = 0
    declare const enum mojiSHift {
        Alfa = 0,
        Kana = 1,
        Kanji = 2
    }
    let kanaShift: number = 0	//0:Alfa,1:Kana,2:Kanji
    /**
     * TODO:文字列を表示する
     * @param pStr 文字列。, eg: "ABCDabcd"
     */
    //% blockId="文字列を表示" block="文字列を表示 %pStr"
    //% weight=100 blockGap=8
    export function showString(pStr: string): void {
        let i: number; let j: number; let k: number
        let lines: number[] = []
        let charCode: number
        let Font: string

        if (initFlag == 0) init();

        for (i = 0; i < pStr.length; i++) {
            charCode = pStr.charCodeAt(i) & 0xff
            if ((charCode >= 0x10) && (charCode <= 0x5f))
                writeData(charCode);
            else if ((kanaShift == mojiSHift.Alfa) && (charCode >= 0x60) && (charCode <= 0x7e))
                writeData(charCode);
            else if ((kanaShift == mojiSHift.Kana) && (charCode >= 0x60) && (charCode <= 0xa0))
                writeData(charCode + 0x40);
            else {
                switch (charCode) {
                    case shiftAlfa().charCodeAt(0):	// \b
                        kanaShift = mojiSHift.Alfa
                        break
                    case shiftKana().charCodeAt(0):	// \t
                        kanaShift = mojiSHift.Kana
                        break
                }
            }
        }
    }
    /**
     * TODO:表示を消去
     */
    //% blockId="表示を消去" block="表示を消去"
    //% weight=98 blockGap=8
    export function cls(): void {
        writeCommand(0x01)
    }
    /**
     * TODO:表示位置指定
     * @param x X座標。, eg: 8
     * @param y Y座標。, eg: 0
     */
    //% blockId="表示位置" block="表示位置 X=%x Y=%y"
    //% weight=96 blockGap=8
    export function locate(x: number, y: number): void {
        writeCommand(0x80 + y*0x40 + x)
    }
    /**
     * write data
     */
    function writeData(d: number): void {
        let buf = pins.createBuffer(2);
        buf[0] = 0x40;
        buf[1] = d;
        pins.i2cWriteBuffer(I2C_ADDR, buf);
    }

    /**
     * write command
     */
    function writeCommand(d: number): void {
        let buf = pins.createBuffer(2);
        buf[0] = 0x00;
        buf[1] = d;
        pins.i2cWriteBuffer(I2C_ADDR, buf);
    }
    /**
     * TODO:英字シフトコード
     */
    //% blockId="英小文字" block="英小文字"
    //% weight=80 blockGap=8
    export function shiftAlfa(): string {
        return "\v"
    }
    /**
     * TODO:カナシフトコード
     */
    //% blockId="カタカナ" block="カタカナ"
    //% weight=78 blockGap=8
    export function shiftKana(): string {
        return "\f"
    }

    /**
     * initialize
     */
    //% blockId="初期化" block="初期化"
    //% weight=100 blockGap=8
    export function init(): void {
        control.waitMicros(100);
        writeCommand(0x38);
        control.waitMicros(20);
        writeCommand(0x39);
        control.waitMicros(20);
        writeCommand(0x14);
        control.waitMicros(20);
        writeCommand(0x73);
        control.waitMicros(20);
        writeCommand(0x52);
        control.waitMicros(20);
        writeCommand(0x6C);
        control.waitMicros(20);
        writeCommand(0x38);
        control.waitMicros(20);
        writeCommand(0x01);
        control.waitMicros(20);
        writeCommand(0x0C);
        control.waitMicros(20);
        initFlag = 1
    }
}
