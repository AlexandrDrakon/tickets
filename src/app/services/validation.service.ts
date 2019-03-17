export class ValidationService {
  static match(control) {
    if (!control.value || control.value && control.value.name) {
      return null;
    }

    return {match: {valid: false}};
  }
}
