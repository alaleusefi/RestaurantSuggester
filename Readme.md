Please make sure you have node.js installed
Run command prompt on the root folder of project and run:

node Find.js <users>.json <venues>.json


After that you will be see the Result in Result.txt file in root folder.

---

The solution is an efficient and highly performant algorithm.
The first solution that comes to mind is probably a simple nested looping to run through all
venues, users, user preferences and venue menus. However that multi-layer nested loop would significantly impact the performance of the algorithm.

If we consider length of the given arrays as:

V = length of the venues array
VF = length of food menu of a typical venue
VD = length of drink menu of a typical venue
U = length of the users array
UF = length of foods to be avoided for a typical user 
UD = length of drinks preferred foods of a typical user

Then run-time cost of the looping algorithm would be:

Run-time-cost = V * U * (VF * UF + VD * UD)

As an example, if we assume V = 20, VF = 10, VD = 10, U = 20, UF = 10, UD = 10
the cost becomes => 20 * 20 * (10 * 10 + 10 * 10) = 80,000

But my algorithm uses bitmasks to remarkably reduce the cost because:

- Calculation of each bitmask requires a two-layer loop only.
- Applying bitmasks (logical AND / OR) requires no looping at all.

Therefore, in my algorithm loop costs are added together rather than multiplied by each other!
This reduces the run time cost by orders of magnitude.
Also the bitMask application is among simplest and fastest machine operations whic makes
cross checking user preferences against venues lightning fast.

In the example above, run-time cost of my algorithm is:

Cost of populating foods union = U * UF + V * VF
Cost of populating drinks union = U * UD + V * VD

Cost of calculating venue food bitmasks = V * VF
Cost of calculating venue drink bitmasks = V * VD

Cost of calculating user food bitmasks = U * UF
Cost of calculating user drink bitmasks = U * UD

Cost of bitmask application = V * U

Run-time-cost = sum of all above =
(U * UF + V * VF ) +
(U * UD + V * VD) + 
V * VF +
V * VD +
U * UF +
U * UD = 1600

The above analysis shows that if length of the input arrays grow,
the simple looping algorithm quickly becomes impractical but my algorithm will happily work
even with arrays of hundreds of people and venues.

Thanks

