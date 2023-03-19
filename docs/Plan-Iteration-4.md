# Plan d'itération 4

| Cible d'évaluation | Itération 4 |
| --- | --- |
| Date d'évaluation | 10 mars 2023 |
| Participants | **Auteurs** :<br />Nicolas Plourde<br />Philippe Lepage<br />Amokrane Smail<br />Samy Mahiddine <br />**Professeurs superviseur** :<br /> Christopher Fuhrman<br />Ali Ouni |
| État du projet | En cours |

## Objectifs clés

1. Remplacer la plateforme d'hébergement par Github pages;
2. Implémenter la logique d'exportation MBZ;
3. Ajouter fonctionnalité de modifier des dates d'évènements;
4. Ajouter fonctionnalité pour supprimer des évènements;
5. Contacter les enseignants ressource à l'instant que les objectifs 2 à 4 sont terminé;
6. Avoir un prototype complet pour faire des démonstrations;
7. Commencer l'organisation de l'interface utilisateur (prototype visuel ou intégration NextUI).

## Identification des risques

| **Risque** | **Impact** | **Prob.** | **Mitigation / atténuation** |
| --- | --- | --- | --- |
| Échéancier trop court | Il se peut que le développement des (POC) soit plus compliqué que prévu, ce qui nécessiterait plus que 2 membres de l'équipe pour le finaliser. | Faible | Subdiviser le développement de la poc de façon atomique afin de pouvoir agréger les composantes et construire l'application finale (design Atomic) |
| Itération trop ambitieuse | L'équipe ne livre pas tous les items. | Moyen | Reporter les items non terminés dans la prochaine itération. |
| Aucun enseignant d'intéresser à collaborer avec le développement | Ralenti et potentiellement stop le développement axé sur les utilisateurs. | Faible | Contacter une grande quantité d'enseignants afin d'avoir des réponses. |
| Délais de familiarisation de l'équipe python avec le prototype web | Diminue la vélocité | Moyen | Faire de revues du code en équipe et épauler les coéquipiers qui ne sont pas familiers avec la solution. |

## Affectations d'éléments de travail

Les éléments de travail suivants seront abordés dans cette itération:

| Nom / Description | Priorité | [Taille estimée (points)](#commentEstimer) | Assigné à (nom) | Documents de référence |
| --- | --- | --- | --- | --- |
| Remplacer la plateforme d'hébergement par Github pages. | 1 | 2 | Nicolas Plourde | Documentation github pages |
| Implémenter la logique d'exportation MBZ. | 1 | 3 | Philippe Lepage | Aucun |
| Ajouter fonctionnalité de suppression d'évènement. | 1 | 2 | Amokrane Smail | [Exemple pour localiser un évènement (onSelectEvent)](https://github.com/jquense/react-big-calendar/blob/master/stories/demos/exampleCode/createEventWithNoOverlap.js) |
| Ajouter fonctionnalité de modifier des dates d'évènements | 1 | 2 | Samy Mahiddine | [Exemple pour localiser un évènement (onSelectEvent)](https://github.com/jquense/react-big-calendar/blob/master/stories/demos/exampleCode/createEventWithNoOverlap.js)|
| Création du prototype de l'interface visuel | 2 | 1 | Nicolas Plourde| Documentation Figma |

## Critères d'évaluation

- Les fonctionnalités planifiées sont développées et fonctionnelles;
- Chaque nouvelle fonctionnalité est testée unitairement;
- Chaque fonctionnalité doit être révisée par les paires

# Affiner la définition et la portée du projet


Le prototype web est maintenant la solution principale développée par l'équipe. L'objectif de cette itération est de mettre en place un fonctionnement basique de celui-ci afin de le présenter aux enseignants pouvant potentiellement l'utiliser et de les impliquer dans le processus de développement.

# Remarques

Lors de la migration de la page Web de Vercel vers GitHub pages, nous avons remarqué que le GitHub pages supporte seulement du contenu HTML statique ce qui signifie que nous ne pouvons pas mettre de proxy dans l'application qui nous permettait de contourner les problèmes liés aux CORS (Cross-Origin resources sharing). Nous sommes donc toujours en recherche de solution pour l'objectif 1.

Il a été discuté lors de la démonstration que les fonctionnalités de modification des dates manuelles ne sont pas utiles pour l'utilisateur. On cherche plutôt à modifier toutes les dates d'une archive Moodle en une action. Cette fonctionnalité sera implémentée en déterminant le positionnement relatif des activités par rapport aux séances de cours et de laboratoire d'où elles proviennent.

Afin d'éviter de développer des fonctionnalités inutiles, pour la prochaine itération, nous allons produire des scénarios de cas d'utilisations et des schémas d'interface afin de confirmer leur utilité et validité au superviseur du projet et aux futurs utilisateurs.