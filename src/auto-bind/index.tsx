/**
 * 成员方法级别 自动绑定
 */
export const autoBindMethod = <T extends Function>(target: any, key: string, descriptor: TypedPropertyDescriptor<T>) => {
    let fn = descriptor.value

    return {
        configurable: true,

        get() {
            if (this === fn.prototype || this.hasOwnProperty(key)) {
                return fn
            }

            let boundFn = fn.bind(this)
            Object.defineProperty(this, key, {
                value: boundFn,
                configurable: true,
                writable: true
            })
            return boundFn
        }
    }
}

/**
 * 类级别 自动绑定
 */
export const autoBindClass = <T extends Function>(target: T): T => {
    let keys = Object.getOwnPropertyNames(target.prototype)

    keys.forEach(key => {
        let descriptor = Object.getOwnPropertyDescriptor(target.prototype, key)

        if (typeof descriptor.value === 'function') {
            Object.defineProperty(target.prototype, key, autoBindMethod(target, key, descriptor))
        }
    })

    return target
}