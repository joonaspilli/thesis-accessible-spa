import { SimpleChanges } from '@angular/core';

interface AssumedComponentPrototype {
  ngOnChanges?: (changes: SimpleChanges) => any;
  ngOnInit?: () => any;
}

type Constructable<T> = new(...args: any[]) => T;

function checkProperties<T>(...properties: Array<keyof T>): any {
  properties.forEach((property: string|number|symbol) => {
    if (this[property] == null) {
      const { name } = this.constructor;
      throw new TypeError(
        `Required property '${String(property)}' of ${name} is not defined.`
      );
    }
  });
}

export const RequiredComponentProperties = <T>(
  ...properties: Array<keyof T>
): (target: Constructable<T>) => void => {
  return (target: Constructable<T>): void => {
    const prototype: AssumedComponentPrototype = target.prototype;
    const ownOnChanges = prototype.ngOnChanges;
    prototype.ngOnChanges = function(changes: SimpleChanges): any {
      checkProperties.bind(this)(...properties);
      if (ownOnChanges) {
        ownOnChanges.bind(this)(changes);
      }
    };
  };
};
