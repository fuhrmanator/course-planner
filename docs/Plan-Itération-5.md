# Plan d'itération 5

| Cible d'évaluation | Itération 5 |
| --- | --- |
| Date d'évaluation | 24 mars 2023 |
| Participants | **Auteurs** :<br /> Nicolas Plourde <br />Philippe Lepage Amokrane Smail<br />Samy Mahiddine <br />**Professeurs superviseur** : <br />Christopher <br />Fuhrman Ali Ouni |
| État du projet | En cours |

## Objectifs clés

1. Rédiger un cas d'utilisation pour appliquer la planification relative;
2. Faire des schémas d'interface utilisateur pour la planification relative;
3. Contacter les enseignants ressource à l'instant que les objectifs 1 à 2 sont terminés;
4. Mettre en place la fonctionnalité de planification relative;
5. Rédiger un cas d'utilisation pour appliquer la suggestion relative;
6. Mettre en place la suggestion relative.

## Identification des risques

| **Risque** | **Impact** | **Prob.** | **Mitigation / atténuation** |
| --- | --- | --- | --- |
| Problème liée au CORS | Impossibilité d'importer le calendrier d'un cours | Élevé | 2 possibilités:
- Héberger un proxy comme end-point pour le contournement ou une fonction serverless
- Ajouter le 'Access-Control-Allow-Origin'-\>'\*' sur l'api que l'on tente de rejoindre
  |

## Affectations d'éléments de travail

Les éléments de travail suivants seront abordés dans cette itération:

| Nom / Description | Priorité | [Taille estimée (points)](#commentEstimer) | Assigné à (nom) | Documents de référence |
| --- | --- | --- | --- | --- |
| Rédaction du cas d'utilisation de planification relative | 1 | 1 | Samy Mahiddine | Indications de M. Fuhrman dans la chaîne Discord générale |
| Conception du schéma d'interface utilisateur | 1 | 2 | Nicolas Plourde | Documentation Figma, cas d'utilisation correspondant |
| Organisation de l'interface web en fonction du prototype | 1 | 2 | Nicolas PlourdeSamy Mahiddine | Prototype |
| Prise de contact d'enseignants | 1 | 1 | Amokrane Smail | Description du projet de fin d'études |
| Implémenter la fonctionnalité de planification relative | 2 | 2 | Amokrane Smail | Ajouter une liste des activités relatives qui permettent la modification selon des menus déroulants. |
| Rédiger le cas d'utilisation de la suggestion relative | 2 | 1 | Philippe Lepage | Aucun |
| Implémenter la suggestion relative | 2 | 2 | Philippe Lepage | CU de la suggestion relative préalablement approuvé |

## Critères d'évaluation

- Les fonctionnalités planifiées sont développées et fonctionnelles;
- Chaque nouvelle fonctionnalité est testée unitairement;
- L'interface doit être révisée et approuver par les paires

# Affiner la définition et la portée du projet

Durant la dernière itération, nous avons développé deux fonctionnalités qui ne correspondaient pas aux besoins des clients. Afin d'éviter que cela se reproduise, nous allons rédiger des cas d'utilisations et les présenter aux clients. Nous développerons ensuite ces fonctionnalités en tenant compte du retour des utilisateurs.

Lors de l'exportation en HTML statique sur la nouvelle solution d'hébergement (GitHub pages), nous avons remarqué que la fonction de contournement pour le CORS n'est pas fonctionnelle. Pour pallier cela, nous avons deux options: soit nous revenons à l'ancienne solution d'hébergement, Vercel, soit nous hébergeons un serveur dans le Cloud pour faire la redirection appelée par la page HTML.

# Remarques

Le CU de suggestion relative correspond aux besoins utilisateur, mais est incomplet puisqu'il ne fait pas usage du DSL défini par l'équipe précédente. Nous aurons donc à adapter en conséquence cette fonctionnalité dans la prochaine itération.


Nous avons effectué une rencontre avec un utilisateur potentiel. Il nous a éclairés sur des cas d'utilisation que nous n'avions pas considérés notamment l'importation de métacours Moodle. L'application répond mal à ceux si nous devrons donc investiguer la source de ce comportement. Il nous a également donné des commentaires sur la convivialité de l'interface. Nous utiliserons ceux-ci et ceux de notre client – superviseur pour adapter le prototype de l'interface avant de l'intégrer dans l'application web.


Une autre rencontre avec un utilisateur se produira dans la semaine.