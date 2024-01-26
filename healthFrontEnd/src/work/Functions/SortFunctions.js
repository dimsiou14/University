export const SortFunctionUserName = (rowA, rowB) => {
    const a = rowA.username.toString()
    const b = rowB.username.toString()

    if (a > b) {
        return 1
    } else if (a < b) {
        return -1 
    }

    return 0
}

export const SortFunctionDoctorName = (rowA, rowB) => {
    const a = rowA.doctorName.toString()
    const b = rowB.doctorName.toString()

    if (a > b) {
        return 1
    } else if (a < b) {
        return -1 
    }

    return 0
}

export const SortFunctionDateTime = (rowA, rowB) => {
    const a = new Date(rowA.recorded).getTime()
    const b = new Date(rowB.recorded).getTime()

    if (a > b) {
        return 1
    } else if (a < b) {
        return -1 
    }

    return 0
}

export const SortFunctionID = (rowA, rowB) => {
    const a = new Date(rowA.historyId).getTime()
    const b = new Date(rowB.historyId).getTime()

    if (a > b) {
        return 1
    } else if (a < b) {
        return -1 
    }

    return 0
}