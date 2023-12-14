export const SortFunctionUserName = (rowA, rowB) => {
    const a = rowA.Username.toString()
    const b = rowB.Username.toString()

    if (a > b) {
        return 1
    } else if (a < b) {
        return -1 
    }

    return 0
}

export const SortFunctionDoctorName = (rowA, rowB) => {
    const a = rowA.DoctorName.toString()
    const b = rowB.DoctorName.toString()

    if (a > b) {
        return 1
    } else if (a < b) {
        return -1 
    }

    return 0
}

export const SortFunctionDateTime = (rowA, rowB) => {
    const a = new Date(rowA.DateTime).getTime()
    const b = new Date(rowB.DateTime).getTime()

    if (a > b) {
        return 1
    } else if (a < b) {
        return -1 
    }

    return 0
}

export const SortFunctionID = (rowA, rowB) => {
    const a = new Date(rowA.Id).getTime()
    const b = new Date(rowB.Id).getTime()

    if (a > b) {
        return 1
    } else if (a < b) {
        return -1 
    }

    return 0
}