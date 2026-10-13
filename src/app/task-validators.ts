import {
  AbstractControl,
  ValidationErrors,
  ValidatorFn,
} from '@angular/forms';

export const titleMin3: ValidatorFn = (
  control: AbstractControl,
): ValidationErrors | null => {
  const title = String(control.value ?? '').trim();

  // Le validateur required gère déjà le champ vide; celui-ci vérifie la longueur.
  if (!title) {
    return null;
  }
  return title.length >= 3 ? null : {titlemin3: true}; // Le validateur renvoie un objet d'erreur si le titre est trop court.
};
