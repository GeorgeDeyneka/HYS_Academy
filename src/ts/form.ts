import { Storage } from "./storage";
import { VALIDATE_MESSAGES } from "./state";
import { formDataType, validateMessagesType } from "./models/interfaces.model";

interface IFormActive {
  onInit(): void;
}

export class FormActive implements IFormActive {
  private readonly classNameChilds: string;
  private readonly parentSelector: HTMLElement;
  private readonly formInputs: HTMLInputElement[];
  private obj: formDataType = {};
  private readonly newStorage = new Storage("formData");

  constructor(parentClassName: string, childClassName: string) {
    this.classNameChilds = childClassName;
    this.parentSelector = document.querySelector(
      `.${parentClassName}`
    ) as HTMLElement;
    this.formInputs = document.querySelectorAll(
      `.${childClassName}`
    ) as unknown as HTMLInputElement[];
    this.onInit();
  }

  onInit(): void {
    this.onFormChange();
    this.setFormData();
    this.submitForm();
    this.validateForm(VALIDATE_MESSAGES);
  }

  private onFormChange(): void {
    this.parentSelector.addEventListener("change", (event: Event) => {
      const target = event.target as HTMLInputElement;
      if (target.classList.contains(this.classNameChilds)) {
        const localStorageObj: {} = this.newStorage.getData();

        if (localStorageObj && Object.keys(localStorageObj).length) {
          this.obj = localStorageObj;
        }

        this.obj[target.getAttribute("name")] = target.value;
        this.newStorage.setData(this.obj);
      }
    });
  }

  private setFormData(): void {
    const data: {} = this.newStorage.getData();

    if (data) {
      this.formInputs.forEach((el: HTMLInputElement) => {
        const valueOfKey = data[el.getAttribute("name") as string];

        if (valueOfKey) {
          el.value = valueOfKey;
        }
      });
    }
  }

  private submitForm(): void {
    this.parentSelector.addEventListener("submit", (event: Event) => {
      event.preventDefault();
      this.newStorage.removeData();

      this.formInputs.forEach((el) => (el.value = ""));

      this.obj = {};
    });
  }

  private validateForm(data: validateMessagesType): void {
    this.parentSelector.addEventListener("input", (event: Event) => {
      const target = event.target as HTMLInputElement;
      if (target.validity.typeMismatch || target.validity.patternMismatch) {
        const id = target.id;
        return target.setCustomValidity(data[id]);
      }

      return target.setCustomValidity("");
    });
  }
}
