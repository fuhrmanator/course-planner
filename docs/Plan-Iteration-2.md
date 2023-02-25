# Plan d'itération 2

| Cible d'évaluation | Itération 2 |
| --- | --- |
| Date d'évaluation | 10 février 2023 |
| Participants | **Auteurs** : <br /> Nicolas Plourde <br /> Philippe Lepage <br /> Amokrane Smail <br /> Samy Mahiddine <br /> **Professeurs superviseur** : <br /> Christopher Fuhrman <br /> Ali Ouni |
| État du projet | En cours |

## Objectifs clés

1. Concevoir l'interface du prototype Vercel;
2. Concevoir l'interface du prototype exécutable Python;
3. Présenter une démonstration technique du CU01 dans les deux prototypes;
4. Analyser la viabilité des deux solutions;
5. Choisir une solution avec le client.

## Identification des risques

| **Risque** | **Impact** | **Prob.** | **Mitigation / atténuation** |
| --- | --- | --- | --- |
| Problèmes de compatibilité technique | Le prototype exécutable Python peut ne pas être compatible avec les systèmes et les environnements requis, ce qui peut entraîner des problèmes de fonctionnement. | Moyen | S'assurer de tester l'exécutable Python sur les différents OS et version afin de détecter et régler les problèmes liés à la compatibilité. |
| Délais non respectés | Le développement des deux prototypes pourrait prendre plus de temps que prévu, ce qui pourrait entraîner un retard dans la présentation de la démonstration technique. | Faible | Établir des échéanciers précis pour chaque tâche et répartir les tâches convenablement au sein de l'équipe. |
| Incompatibilité d'une application web sans serveur et des fonctionnalités désirées | Empêcherait le prototypage d'une telle application et la viabilité d'une solution utilisant cette technologie. | Moyen | Rechercher des façons de faire alternative pour contourner les limitations d'une application sans serveur. |
| Les solutions proposées ne conviennent pas au client. | Le travail effectué sur les deux prototypes est perdu et une autre solution doit être explorée. | Faible | Faire un suivi du progrès avec le client afin de s'assurer que les fonctionnalités développées lui conviennent. |

## Affectations d'éléments de travail

Les éléments de travail suivants seront abordés dans cette itération:

| Nom / Description | Priorité | [Taille estimée (points)](#commentEstimer) | Assigné à (nom) | Documents de référence |
| --- | --- | --- | --- | --- |
| Interface prototype exécutable | 1 | 1 | Amokrane et Nicolas | Channel #décision-implémentation |
| Interface prototype Vercel | 1 | 1 | Philippe et Samy | Channel #décision-implémentation |
| CU01 pour prototype exécutable | 1 | 1.5 | Amokrane et Nicolas | dss-obtenirHoraire |
| CU01 pour prototype Vercel | 2 | 1.5 | Philippe et Samy | dss-obtenirHoraire |

## Critères d'évaluation

- Les deux prototypes sont fonctionnels;
- Le CU1, obtenir un horaire de cours à partir des ressources de l'ÉTS est fonctionnel pour les deux prototypes.

# Affiner la définition et la portée du projet
#

La dernière itération nous a appris que la technologie d'extension du fureteur est incompatible avec les fonctionnalités désirées pour le prototype. Le problème venait du fait qu'il fallait encapsuler des librairies serveur pour supporter les fonctionnalités du _activity-connector_ et que celles-ci ne peuvent pas s'exécuter dans un navigateur.

C'est pour cette raison que durant cette itération nous développerons deux prototypes alternatifs que nous présenterons au client. Le premier prototype aura un code source en python et sera transformé en un exécutable que le client pourra utiliser. Le deuxième prototype sera une page statique hébergé sur vercel. Cette page n'aura pas d'application serveur et utilisera le stockage local du navigateur des enseignants.

# Remarques

Étant donné que l'objectif de cette itération est plus de proposer des solutions potentielles que de développer des fonctionnalités et de la logique, aucun test automatisé ne fut fait sur le code présenté. Une série de tests sera développée pour chaque fonctionnalité supplémentaire sur la solution sélectionnée lors de la démonstration.