<script>
  import { events, trackViewed } from '$lib/actions/track'
</script>

<div class="plans">
  <div class="plan plan--light">
    <h1>Light</h1>
    <ul>
      <li>100 submission/month</li>
      <li>Single file upload</li>
      <li>Max 1MB per submission</li>
      <li>250MB file storage</li>
      <li>Email notifications</li>
      <li>No Dropzone branding</li>
    </ul>
    <div class="price">
      <small><strong>30</strong> days <strong>free trial</strong>, then</small>
      <span use:trackViewed={events.pricingViewed} class="price__number"
        >$4</span
      >
      <small>net per month</small>
    </div>
  </div>
  <div class="plan plan--plus">
    <h1>Plus</h1>
    <ul>
      <li>1,000 submissions/month</li>
      <li>Multiple file upload</li>
      <li>Max 5MB per submission</li>
      <li>1GB file storage</li>
      <li>CSV & JSON export</li>
    </ul>
    <div class="price">
      <small><strong>30</strong> days <strong>free trial</strong>, then</small>
      <span class="price__number">$10</span>
      <small>net per month</small>
    </div>
  </div>
  <div class="plan plan--premium">
    <h1>Premium</h1>
    <ul>
      <li>10,000 submissions/month</li>
      <li>Max 25MB per submission</li>
      <li>5GB file storage</li>
    </ul>
    <div class="price">
      <small><strong>30</strong> days <strong>free trial</strong>, then</small>
      <span class="price__number">$16</span>
      <small>net per month</small>
    </div>
  </div>
</div>

<style>
  .plans {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(18rem, 1fr));
    gap: 3rem;
  }

  .plan {
    border: 2px solid var(--border-color);
    background: var(--background-color);
    padding: 2rem 1.5rem;
    border-radius: 5px;
    display: flex;
    align-items: center;
    flex-direction: column;
  }
  .plan--light {
    --border-color: #c8b4ea;
    --background-color: #eae3f7;
  }
  .plan--plus {
    --border-color: #39ac98;
    --background-color: #d4eee9;
  }
  .plan--premium {
    --border-color: #f5a428;
    --background-color: #ffeccd;
  }

  h1 {
    color: black;
    font-size: 1.5rem;
    margin-bottom: 2rem;
  }

  ul {
    flex: 1;
    list-style-image: url('/images/list-checkmark.svg');
  }

  li {
    margin: 0.25rem 0;
    padding-left: 0.5rem;
  }

  .price {
    margin-top: 2rem;
    text-align: center;
  }
  .price__number {
    font-family: var(--font-header);
    font-size: 3.125rem;
    font-weight: bold;
    color: black;
  }
  .price small {
    font-size: 0.875rem;
    display: block;
    text-align: center;
  }
</style>
