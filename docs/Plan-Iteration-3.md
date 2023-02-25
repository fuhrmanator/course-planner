# Plan d'itération 2

| Cible d'évaluation | Itération 3 |
| --- | --- |
| Date d'évaluation | 24 février 2023 |
| Participants | **Auteurs** :<br /> Nicolas Plourde <br />Philippe Lepage <br />Amokrane Smail <br />Samy Mahiddine <br />**Professeurs superviseur** : <br />Christopher Fuhrman <br />Ali Ouni |
| État du projet | En cours |

## Objectifs clés

1. Ajouter une fonctionnalité minimale de définition d'une activité démagogique;
2. Conception d'une preuve de concept afin de télécharger et importer un fichier de type .mbz qui contient les activités définies par l'utilisateur;
3. Déployer la solution web sur GitHub Pages;
4. Présentation technique des preuves de concept;
5. Choix d'une solution finale en fonction de plusieurs aspects.

## Identification des risques

| **Risque** | **Impact** | **Prob.** | **Mitigation / atténuation** |
| --- | --- | --- | --- |
| Échéancier trop court | Il se peut que le développement des (POC) soit plus compliqué que prévu, ce qui nécessiterait plus que 2 membres de l'équipe pour le finaliser. | Faible | Subdiviser le développement de la poc de façon atomique afin de pouvoir agréger les composantes et construire l'application finale (design atomic) |
| Risque de stockage insuffisant si les fichiers téléchargés et importés sont volumineux. | Si la mémoire disponible est insuffisante, il peut être difficile de sauvegarder les fichiers téléchargés et importés en toute sécurité. Cela peut entraîner la perte de données importantes. | Faible | Explorer la possibilité d'inclure des librairies qui permettent d'accéder aux fichiers locaux pour surpasser les limitations de mémoire.|
| Risque de limitation et flexibilité qu'offre GitHub Pages | GitHub Pages offre moins de flexibilité pour la configuration et la personnalisation du déploiement que Vercel, ce qui peut limiter la capacité de la solution à répondre aux besoins des utilisateurs. | Moyen | Explorer la possibilité d'utiliser des plugins prédéfinis ou des outils de GitHub Action Marketplace afin de faciliter le déploiement des nouvelles fonctionnalités qui répondraient aux besoin des utilisateurs. |

## Affectations d'éléments de travail

Les éléments de travail suivants seront abordés dans cette itération:

| Nom / Description | Priorité | [Taille estimée (points)](#commentEstimer) | Assigné à (nom) | Documents de référence |
| --- | --- | --- | --- | --- |
| Fonctionnalité minimale pour ajouter une activité de cours | 1 | 1 | WEB : Samy Mahiddine | CU1 Ajouter une activitée |
| Supporter l'importation d'un MBZ | 1 | 3 | WEB : Philippe Lepage<br />PY : Amokrane Smail | Aucun |
| Supporter l'exportation d'un MBZ contenant les activités définies | 1 | 2 | WEB : Philippe Lepage<br />PY : Amokrane Smail | Aucun |

## Critères d'évaluation

- Les deux prototypes sont fonctionnels;
- Pour l'importation, il faut voir les activités du fichier Test dans l'interface.

# Affiner la définition et la portée du projet

Si nous réussissons à démontrer dans cette itération que le prototype web peut supporter l'importation de fichiers MBZ et leur exportation, nous concentrerons nos efforts de développement sur ce prototype. Après cette preuve de concept nous aurons démontré que la technologie web choisie permet d'effectuer tout ce qui était comportait un risque d'être incompatible avec celle-ci. Nous choisirons donc de développer le prototype web puisque c'est lui qui offre le plus de convivialité d'utilisation.

# Remarques
Étant donné que l’itération a eu lieu durant la semaine des examens intra, cette itération a eu des résultats moins avancés que prévu. Pour la prochaine itération, nous allons devoir rattraper ce qui aurait été fait et continuer avec l’itération 4.  