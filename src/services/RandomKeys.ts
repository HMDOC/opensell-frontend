// POSTION FROM ASCI TABLE
enum AsciLetter {
    FIRST_LOWER = 97,
    LAST_LOWER = 122,
    FIRST_UPPER = 65, 
    LAST_UPPER = 90
}

function nextInt(min: number, max: number): number {
    return Math.floor(
        (Math.random() * (max - min + 1))
    ) + min;
}

/**
 * Function that return a random letter using the position of the ASCII table.
 * For example, 'a' is at position 97 in the ASCI table.
 * 
 * @author Achraf
 */
function randAsciiLetter(): string {
    // Random to choose between upper(1) or lower(0).
    if(Math.floor(Math.random()) === 1) {
        return String.fromCharCode(nextInt(AsciLetter.FIRST_UPPER, AsciLetter.LAST_UPPER));
    } else {
        return String.fromCharCode(nextInt(AsciLetter.FIRST_LOWER, AsciLetter.LAST_LOWER));
    }
}

/**
 * 
 * @author Achraf
 */
export function createRandomKey(): string {
    var key = randAsciiLetter();

    for(let i = 0; i < 29; i++) {
        key += randAsciiLetter();
    }
    
    return key;
}