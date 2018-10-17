# adapt-select-memo
The **adapt-select-memo component** is a component for the adapt learning framework: Working on a selection for two or three times. Offering to select a number of items among others and displaying the change on the first read. On the second read it offers to alter the selection of the first read and displays the differences.
You will have to implement the component as many times as you want the Learner to reconsider the given topic. Be sure to fill in the same topic, the same options but different steps (first, second, third).


Settings
--------
### Attributes

**storageName (string)**: Specify the name for the DB where to put the selection.

**step (string)**: Specify the mode (readonly or editable) in which the component will be used.

**topic (string)**: Specify the topic in short form for a range of memoss.

**inputId (string)**: Specify an ID for all options of your selection.

**maxSelect (number)**: Specify how many options may be selected, zero (0) meaning as many as you want.

**step (string)**: Specify what step you intend: first or second or third visit? The second visit would intend that you see your choices of the first visit and alter them. Third visit offers to repeat this learning process once more.

**items (array)**: The options available to the learner.

**reset_this (string)**: Specify the capture of the button.

**displayTitle (string)**: The title to display above.

**body (string, optional)**: A message to display before select is shown.

**instruction** (string): This optional text appears above the component. It is frequently used to
guide the learner’s interaction with the component.

**_classes (string)**: CSS class name to be applied to the button's containing div. The class must be predefined in one of the Less files. Separate multiple classes with a space.

**_supportedLayout (string)**: This defines the horizontal position of the component in the block. Acceptable values are full, left or right.

TODO
-----------
Using model-view-structure more efficiently. Next step will be a rewrite of the model and a transfer of function from view to model - for example saveDB.



Limitations
-----------
No known limitations.

-----------
The **Select-Memo Component** is a plugin for the Adapt Framework. [Adapt](https://www.adaptlearning.org) is a free and easy to use e-learning authoring tool that creates fully responsive, multi-device, HTML5 e-learning content using the award-winning Adapt developer framework.
