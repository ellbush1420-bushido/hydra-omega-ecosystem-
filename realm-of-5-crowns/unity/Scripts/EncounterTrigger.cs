using UnityEngine;

public class EncounterTrigger : MonoBehaviour
{
    void OnTriggerEnter(Collider other)
    {
        if (other.CompareTag("Player"))
        {
            Debug.Log("Trial of Steel: Gate Warden engaged");
        }
    }
}
