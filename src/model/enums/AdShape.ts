enum AdShape {
    NEW,
    LIKE_NEW,
    GOOD,
    USABLE,
    BAD,
    UNKNOWN
}

export default AdShape;

export const getShapeStr = (shape?: AdShape): string | undefined => {
    switch(shape) {
        case AdShape.NEW:
            return "New";
        case AdShape.LIKE_NEW:
            return "Like new";
        case AdShape.GOOD:
            return "Good";
        case AdShape.USABLE:
            return "Usable";
        case AdShape.BAD:
            return "Bad";
        case AdShape.UNKNOWN:
            return "Unknown";
        default:
            return undefined;
    }
}