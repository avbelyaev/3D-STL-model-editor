/**
 * Created by anthony on 24.02.2018.
 */

class Models {

    static extractMeshModel(base64edStl) {
        return {
            'stl': base64edStl
        }
    }

    static performOnStlModel(operation, base64edStl1, base64edStl2) {
        return {
            'operation': operation,
            'stl1': base64edStl1,
            'stl2': base64edStl2
        }
    }
}

const Operations = Object.freeze({
    UNION: {
        id: "difference_ba",
        label: "Объединение" // объединение +++
    },
    INTERSECT: {
        id: "difference_ab",
        label: "Пересечение" // пересечение +++
    },
    DIFF_AB: {
        id: "intersection",
        label: "Дополнение (a-b)" // А-Б (куб-нога)
    },
    DIFF_BA: {
        id: "union",
        label: "Дополнение (b-a)" // Б-А (нога - куб) +++
    }
});
