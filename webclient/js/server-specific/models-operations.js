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

class Operations {
    static operations() {
        return [
            {
                id: "union",
                label: "Объединение"
            },
            {
                id: "intersection",
                label: "Пересечение"
            },
            {
                id: "difference_ab",
                label: "Вычитание (a-b)"
            },
            {
                id: "difference_ba",
                label: "Вычитание (b-a)"
            }
        ];
    }
}
