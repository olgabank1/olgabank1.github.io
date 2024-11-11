function generateRandom6DigitString(): string {
    const min = 100000; // Smallest 6-digit number
    const max = 999999; // Largest 6-digit number
    const randomNum = Math.floor(Math.random() * (max - min + 1)) + min;
    return randomNum.toString();
}

function beregnKontrollsiffer(kontonummer: string): number | null {
    if (kontonummer.length !== 10) throw new Error("Kontonummer må være 10 siffer.");

    const vekttall = [2, 3, 4, 5, 6, 7, 2, 3, 4, 5];
    const sum = kontonummer
        .split('')
        .reduce((acc, siffer, i) => acc + parseInt(siffer) * vekttall[i], 0);

    const kontrollsiffer = (11 - (sum % 11)) % 11;
    return kontrollsiffer === 10 ? null : kontrollsiffer;
}

function generateRandomAccountNumber(bankIndex?: number) {
    const bank = ["1111", "2222", "3333", "4444", "5555", "6666"]
    return bank[bankIndex || Math.floor(Math.random() * bank.length)] + generateRandom6DigitString() + beregnKontrollsiffer(bank[Math.floor(Math.random() * bank.length)] + generateRandom6DigitString())



}

export const initialData = {
    accounts: [
        {
            name: "Forbrukskonto",
            number: generateRandomAccountNumber(1),
            amount: 2000
        },
        {
            name: "Sparing",
            number: generateRandomAccountNumber(1),
            amount: 300000
        },
        {
            name: "Pansjon",
            number: generateRandomAccountNumber(1),
            amount: 200000
        },
    ],
    contacts: [
        {
            name: "Datter List",
            number: generateRandomAccountNumber(),
        },
        {
            name: "Nevø Øyvind",
            number: generateRandomAccountNumber(),
        },
    ],
}