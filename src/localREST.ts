

type SharedFunctions = {
    save: (key: string, value: string) => void;
    load: (key: string) => string | undefined;
    initialValues: { [key: string]: any }
};

// fremfor å lagre i array kan det lagres i object med en id
// trenger en wrapper rundt og som holder orden på neste index og verdiene

// trenger å plukke ting ut fra path

const sharedFunctions: SharedFunctions = {} as SharedFunctions;

export type WithId<T> = Partial<T> & { id: number };

export function createLocalREST(
    save: SharedFunctions["save"],
    load: SharedFunctions["load"],
    initialValues?: { [key: string]: any[] },
    overwriteStore?: boolean
) {
    sharedFunctions.save = save;
    sharedFunctions.load = load;
    if (initialValues) {

        Object.entries(initialValues).forEach(([index, value]) => {
            if (overwriteStore || !load(index)) {
                let currentIndex = 1
                const storable = value.reduce((acc, item) => {
                    item.id = currentIndex
                    acc[currentIndex] = item
                    currentIndex++
                    return acc

                }, {})
                save(index, JSON.stringify({ values: storable, currentIndex }))
            }
        })
    }

}

export type StorageWrapper<T> = {
    values: { [key: number]: WithId<T> },
    currentIndex: number
}

export function localRESTPost<T>(path: string, values: T[]): number[] {
    const indexes = [] as number[]
    const existingRaw = sharedFunctions.load(path) || `{"values":{}, "currentIndex": 1}`;
    const existing = JSON.parse(existingRaw) as StorageWrapper<T>;
    values.forEach(value => {

        indexes.push(existing.currentIndex)
        existing.values[existing.currentIndex] = { ...value, id: existing.currentIndex }
        existing.currentIndex++
    })

    sharedFunctions.save(path, JSON.stringify(existing));
    return indexes
}
export function localRESTPut<T>(path: string, value: WithId<T>) {
    const existingRaw = sharedFunctions.load(path) || `{"values":{}, "currentIndex": 1}`;
    const existing = JSON.parse(existingRaw) as StorageWrapper<T>;
    existing.values[value.id] = value
    sharedFunctions.save(path, JSON.stringify(existing));
}
export function localRESTGet<T>(path: string, index?: number): WithId<T>[] {
    const storage = JSON.parse(sharedFunctions.load(path) || "[]") as StorageWrapper<T>;
    if (index) {

        return [storage.values[index]]
    }
    return Object.values(storage.values)
}

export function localRESTDelete<T>(path: string, id: number) {
    const existingRaw = sharedFunctions.load(path) || `{"values":{}, "currentIndex": 0}`;
    const existing = JSON.parse(existingRaw) as StorageWrapper<T>;
    delete existing.values[id]
    sharedFunctions.save(path, JSON.stringify(existing));
}
