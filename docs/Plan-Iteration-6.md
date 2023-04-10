# Plan d'itération 6

| Cible d'évaluation | Itération 6 |
| --- | --- |
| Date d'évaluation | 7 avril 2023 |
| Participants | **Auteurs** :<br />Nicolas Plourde<br />Philippe Lepage<br />Amokrane Smail<br />Samy Mahiddine <br />**Professeurs superviseurs** : <br />Christopher Fuhrman<br />Ali Ouni |
| État du projet | En cours |

## Objectifs clés

1. Rédiger un cas d'utilisation pour intégrer le DSL;
2. Intégrer le DSL dans l'application;
3. Adapter le prototype de l'interface utilisateur en fonction des commentaires de la démonstration;
4. Appliquer l'interface du prototype à l'application web;
5. Terminer d'implémenter la planification relative de tâche individuelle.
6. Investiguer le bogue de l'importation de métacours;
7. Mener des entrevues avec d'autres utilisateurs potentiels.

## Identification des risques

| **Risque** | **Impact** | **Prob.** | **Mitigation / atténuation**                                                                                                                              |
| --- | --- | --- |-----------------------------------------------------------------------------------------------------------------------------------------------------------|
| Problème lié à l'intégration du DSL | Impossibilité d'ajouter le DSL au sein de l'application web | Faible | Soit contacter le client afin d'obtenir de l'aide sur l'intégration du DSL, soit faire une exploration technique pour les éventuelles solutions possibles |

## Affectations d'éléments de travail

Les éléments de travail suivants seront abordés dans cette itération:

| Nom / Description                                                                                  | Priorité | [Taille estimée (points)](#commentEstimer) | Assigné à (nom) | Documents de référence |
|----------------------------------------------------------------------------------------------------| --- | --- | --- | --- |
| Rédiger le CU du DSL                                                                               | 1 | 1 | Philippe Lepage |
|
| Implémenter la planification relative en utilisant le DSL                                          | 1 | 1 | Philippe Lepage |
|
| Adapter le prototype de l'interface utilisateur en fonction des commentaires de la démonstration.  | 1 | 2 | Nicolas Plourde |
|
| Appliquer l'interface du prototype à l'application web                                             | 1 | 1 | Nicolas Plourde |
|
| Terminer d'implémenter la planification relative de tâche individuelle                             | 1 | 2 | Amokrane Smail |
|
| Investiguer le bogue de l'importation de métacours                                                 | 2 | 1 | Samy Mahiddine |
|
| Mener des entrevues avec d'autres utilisateurs potentiels                                          | 2 | 1 | Toute l'équipe | Courriel d'invitation envoyé aux enseignants |

## Critères d'évaluation

- Les fonctionnalités planifiées sont développées et fonctionnelles;
- Chaque nouvelle fonctionnalité est testée unitairement;
- L'interface doit être révisée et approuver par les paires

# Affiner la définition et la portée du projet

Le CU de suggestion relative correspond aux besoins utilisateur, mais est incomplet puisqu'il ne fait pas usage du DSL défini par l'équipe précédente. Nous aurons donc à adapter en conséquence cette fonctionnalité dans la prochaine itération.

Nous avons effectué une rencontre avec un utilisateur potentiel. Il nous a éclairés sur des cas d'utilisation que nous n'avions pas considérés notamment l'importation de métacours Moodle. L'application répond mal à ceux si nous devrons donc investiguer la source de ce comportement. Il nous a également donné des commentaires sur la convivialité de l'interface. Nous utiliserons ceux-ci et ceux de notre client – superviseur pour adapter le prototype de l'interface avant de l'intégrer dans l'application web. De plus, lors de la rencontre avec un éventuel utilisateur, nous avons rencontré un nouveau bogue dans notre application. Celui-ci est lié à l'importation d'une sauvegarde de type du métacours sur Moodle. L'importation fonctionne, mais les dates qui s'affichent sur le calendrier sont fausses. Une investigation de ce problème est ouverte et devrait être réglée d'ici la prochaine itération.

Une autre rencontre avec un utilisateur se produira dans la semaine.

Si tous les éléments de cette itération sont réussis le projet supportera essentiellement les mêmes fonctionnalités que l'application référence "activity-connector", mais avec la valeur ajoutée d'être déployé sur le web et de fournir une interface utilisateur.

# Remarques

Le projet tire maintenant à sa fin. Certains points de l'itération, notamment les objectifs numéro 4 et 5 n'ont pas été complétés avant la démonstration. Nous ferons notre possible pour les livrer avant la présentation finale.

Nous avons également soulevé les améliorations suivantes comme pertinentes au projet. Nous tenterons d'en réaliser un maximum avant la fin et rédigerons des scénarios d'utilisation pour les restants afin de les illustrer aux prochains développeurs qui travailleront sur l'application.

- Griser les menus pour modifier les dates lorsque certaines ne sont pas fournies par le devoir, notamment due et cutoff
- Ajouter un checkbox qui active et désactive l'entrée de type @ pour la modification des dates relatives indicielle.
- Permettre d'exporter les évènements du calendrier en format ICS.
- Intégrer le DSL à la modification de date relative individuelle.

Le bogue des métacours fut évalué comme non pertinent durant l'itération. La raison de cette décision sera documentée comme avertissement dans le readme et détaillé dans le rapport final.

Finalement il a été décidé que plutôt que produire une manuelle utilisateur, nous produirons des vidéos explicatives qui démontrent le fonctionnement de l'application.